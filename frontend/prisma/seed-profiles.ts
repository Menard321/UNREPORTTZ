import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { ProfileSchema } from "../src/lib/profiles/schema";
import { lintCoverTemplate } from "../src/lib/profiles/linter";

const prisma = new PrismaClient();

function mapVerificationStatus(rawStatus: string): string {
  switch (rawStatus) {
    case "from_guideline_unverified_date":
      return "official_guideline";
    case "department_template_unverified_date":
      return "department_template";
    case "student_sample_unverified":
      return "student_sample";
    default:
      return rawStatus;
  }
}

async function main() {
  console.log("🌱 Starting Institution Profiles Seeding...");

  const profilesFilePath = path.join(
    process.cwd(),
    "..",
    "data",
    "profiles",
    "reportwise-university-profiles.json"
  );

  if (!fs.existsSync(profilesFilePath)) {
    console.error(`❌ Profiles file not found at ${profilesFilePath}`);
    process.exit(1);
  }

  const profilesRaw = fs.readFileSync(profilesFilePath, "utf-8");
  const rawProfiles = JSON.parse(profilesRaw);

  let profilesCreated = 0;
  let profilesUpdated = 0;
  let linterWarnings = 0;

  for (const rawProfile of rawProfiles) {
    // 1. Zod schema validation
    const validation = ProfileSchema.safeParse(rawProfile);
    if (!validation.success) {
      console.error(`❌ Profile ${rawProfile.id} failed Zod validation:`, validation.error.format());
      continue;
    }

    const profileData = validation.data;

    // 2. Cover Linter execution
    const lintErrors = lintCoverTemplate(profileData.cover.lines);
    if (lintErrors.length > 0) {
      console.warn(`⚠️ Cover Linter warnings for profile "${profileData.id}":`);
      lintErrors.forEach((err) => {
        console.warn(`   Line [${err.lineIndex}]: "${err.template}" -> ${err.reason}`);
        linterWarnings++;
      });
    }

    // 3. Find or create Institution record
    let inst = await prisma.institution.findFirst({
      where: {
        OR: [
          { name: { equals: profileData.institution, mode: "insensitive" } },
          { shortName: { equals: profileData.id.split("-")[0].toUpperCase(), mode: "insensitive" } }
        ]
      }
    });

    if (!inst) {
      inst = await prisma.institution.create({
        data: {
          name: profileData.institution,
          shortName: profileData.id.split("-")[0].toUpperCase(),
          type: "university",
          country: "Tanzania",
          active: true,
        },
      });
    }

    const mappedStatus = mapVerificationStatus(profileData.verification.status);

    // 4. Upsert InstitutionProfile
    const upsertedProfile = await prisma.institutionProfile.upsert({
      where: { slug: profileData.id },
      update: {
        institutionId: inst.id,
        matching: profileData.matching,
        reportTypeKey: profileData.reportTypeKey,
        labels: profileData.labels,
        cover: profileData.cover,
        frontMatter: profileData.frontMatter,
        chapters: profileData.chapters,
        references: profileData.references,
        appendices: profileData.appendices,
        formatting: profileData.formatting,
        source: profileData.source,
        verificationStatus: mappedStatus,
        verificationNote: profileData.verification.note || null,
        version: 1,
        isActive: true,
        rawJson: profileData,
      },
      create: {
        id: profileData.id,
        institutionId: inst.id,
        slug: profileData.id,
        matching: profileData.matching,
        reportTypeKey: profileData.reportTypeKey,
        labels: profileData.labels,
        cover: profileData.cover,
        frontMatter: profileData.frontMatter,
        chapters: profileData.chapters,
        references: profileData.references,
        appendices: profileData.appendices,
        formatting: profileData.formatting,
        source: profileData.source,
        verificationStatus: mappedStatus,
        verificationNote: profileData.verification.note || null,
        version: 1,
        isActive: true,
        rawJson: profileData,
      },
    });

    profilesCreated++;

    // 5. Expand chapters into ProfileSection rows
    await prisma.profileSection.deleteMany({
      where: { profileId: upsertedProfile.id },
    });

    let orderIndex = 1;
    for (let cIdx = 0; cIdx < profileData.chapters.length; cIdx++) {
      const chapter = profileData.chapters[cIdx];
      for (let sIdx = 0; sIdx < chapter.sections.length; sIdx++) {
        const sectionTitle = chapter.sections[sIdx];
        await prisma.profileSection.create({
          data: {
            profileId: upsertedProfile.id,
            chapterIndex: cIdx + 1,
            order: orderIndex++,
            title: sectionTitle,
            kind: chapter.topic || "generic",
            required: true,
            questionKeys: ["default"],
          },
        });
      }
    }
  }

  console.log(`\n✅ Institution Profiles Seeding Complete:`);
  console.log(`  - Profiles Processed: ${profilesCreated}`);
  console.log(`  - Linter Warnings: ${linterWarnings}\n`);
}

main()
  .catch((e) => {
    console.error("❌ Profiles Seeding Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
