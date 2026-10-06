import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Catalog Seeding...");

  const catalogFilePath = path.join(process.cwd(), "..", "data", "profiles", "catalog.json");
  if (!fs.existsSync(catalogFilePath)) {
    console.error(`❌ Catalog file not found at ${catalogFilePath}`);
    process.exit(1);
  }

  const catalogRaw = fs.readFileSync(catalogFilePath, "utf-8");
  const catalog = JSON.parse(catalogRaw);

  let instCreated = 0, instUpdated = 0;
  let unitCreated = 0, unitUpdated = 0;
  let deptCreated = 0, deptUpdated = 0;
  let progCreated = 0, progUpdated = 0;

  for (const instData of catalog.institutions || []) {
    const inst = await prisma.institution.upsert({
      where: { id: instData.id },
      update: {
        name: instData.name,
        shortName: instData.shortName,
        type: instData.type,
        country: instData.country || "Tanzania",
        logoFile: instData.logoFile || null,
        active: true,
      },
      create: {
        id: instData.id,
        name: instData.name,
        shortName: instData.shortName,
        type: instData.type,
        country: instData.country || "Tanzania",
        logoFile: instData.logoFile || null,
        active: true,
      },
    });
    instCreated++;

    for (const unitData of instData.units || []) {
      const unit = await prisma.academicUnit.upsert({
        where: { id: unitData.id },
        update: {
          name: unitData.name,
          shortName: unitData.shortName || null,
          kind: unitData.kind,
          institutionId: inst.id,
        },
        create: {
          id: unitData.id,
          name: unitData.name,
          shortName: unitData.shortName || null,
          kind: unitData.kind,
          institutionId: inst.id,
        },
      });
      unitCreated++;

      for (const deptData of unitData.departments || []) {
        // Store WITHOUT the word "Department"
        const cleanDeptName = deptData.name.replace(/^Department\s+of\s+/i, "").trim();

        const dept = await prisma.department.upsert({
          where: { id: deptData.id },
          update: {
            name: cleanDeptName,
            unitId: unit.id,
          },
          create: {
            id: deptData.id,
            name: cleanDeptName,
            unitId: unit.id,
          },
        });
        deptCreated++;

        for (const progData of deptData.programmes || []) {
          await prisma.programme.upsert({
            where: { id: progData.id },
            update: {
              name: progData.name,
              level: progData.level,
              durationYears: progData.durationYears || 3,
              unitId: unit.id,
              departmentId: dept.id,
              needsVerification: false,
            },
            create: {
              id: progData.id,
              name: progData.name,
              level: progData.level,
              durationYears: progData.durationYears || 3,
              unitId: unit.id,
              departmentId: dept.id,
              needsVerification: false,
            },
          });
          progCreated++;
        }
      }
    }
  }

  console.log(`\n✅ Catalog Seeding Complete:`);
  console.log(`  - Institutions: ${instCreated} processed`);
  console.log(`  - Academic Units: ${unitCreated} processed`);
  console.log(`  - Departments: ${deptCreated} processed`);
  console.log(`  - Programmes: ${progCreated} processed\n`);
}

main()
  .catch((e) => {
    console.error("❌ Catalog Seeding Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
