import { z } from "zod";

export const CoverLineSchema = z.object({
  field: z.string(),
  template: z.string(),            // tokens such as "DEPARTMENT OF {department.name|upper}"; empty for the logo slot
  style: z.string().default(""),   // for example "bold center", "label-fill", "bold center 14pt"
  addedByReportWise: z.boolean().optional(),
  note: z.string().optional(),
});

export const ProfileLabelsSchema = z.object({
  reportName: z.string().default("Field Practical Training Report"),
  photoLabel: z.enum(["Figure", "Plate"]).default("Figure"),
  figureListTitle: z.string().default("List of Figures"),
  abbreviationsTitle: z.string().default("List of Abbreviations"),
});

export const ProfileSchema = z.object({
  id: z.string(),
  institution: z.string(),                       // used for matching and seeding only, never printed
  scope: z.object({
    faculty: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    programmeLevel: z.string().nullable().optional(),
    yearOfTraining: z.string().nullable().optional(),
  }),
  matching: z.object({
    appliesToOtherCoursesOfInstitution: z.boolean().default(true),
    notice: z.string().optional(),
  }).passthrough(),
  reportTypeKey: z.string(),
  labels: ProfileLabelsSchema.optional().default({
    reportName: "Field Practical Training Report",
    photoLabel: "Figure",
    figureListTitle: "List of Figures",
    abbreviationsTitle: "List of Abbreviations",
  }),
  source: z.object({
    file: z.string(),
    kind: z.string(),
    detail: z.string().optional(),
    pageSize: z.string().optional()
  }),
  verification: z.object({
    status: z.string(),
    note: z.string().optional()
  }),
  cover: z.object({
    lines: z.array(CoverLineSchema),
    border: z.string().nullable().optional(),    // none | single thick | double line
    labelStyle: z.string().optional(),
  }).passthrough(),
  frontMatter: z.array(
    z.object({
      key: z.string(),
      numbering: z.string().optional(),
      note: z.string().optional(),
      style: z.string().optional(),
      title: z.string().optional()
    })
  ),
  chapters: z.array(
    z.object({
      title: z.string(),
      topic: z.string().optional(),
      note: z.string().optional(),
      sections: z.array(z.string()),
      requiresVerifiedReferences: z.boolean().optional(),
      photoHeavy: z.boolean().optional()
    })
  ),
  references: z.object({
    style: z.string(),
    note: z.string().optional()
  }),
  appendices: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      needsUserUpload: z.boolean().optional()
    })
  ),
  formatting: z.object({
    measured: z.boolean().optional(),
    fontFamily: z.string().optional(),
    fontSizeBody: z.string().optional(),
    lineSpacing: z.string().optional(),
    alignment: z.string().optional(),
    margins: z.string().optional(),
    pageNumberingFront: z.string().optional(),
    pageNumberingBody: z.string().optional()
  }).passthrough(),
  observations: z.array(z.string()).optional(),
});

export type CoverLine = z.infer<typeof CoverLineSchema>;
export type ProfileLabels = z.infer<typeof ProfileLabelsSchema>;
export type ProfileType = z.infer<typeof ProfileSchema>;

export interface ReportContext {
  institution: {
    name: string;
    shortName: string;
  };
  unit: {
    name: string;
    shortName?: string;
  };
  department?: {
    name: string;
  };
  programme: {
    name: string;
    level?: string;
  };
  student: {
    surname: string;
    otherNames: string;
    name?: string;               // full formatted e.g. "SURNAME, First Middle"
    surnameFirst?: string;       // e.g. "MSANGI, Baraka John"
    regNo: string;
    yearOfStudy?: string | number;
    yearRoman?: string;          // derived e.g. "III"
    yearWords?: string;          // derived e.g. "Three"
    semester?: string;
  };
  academicYear?: string;
  report: {
    title: string;
  };
  organization?: {
    name?: string;
    place?: string;
  };
  period?: {
    text?: string;
    startDate?: string;
    endDate?: string;
    durationWeeks?: string;
  };
  logbook?: {
    fileName?: string;
    fileSize?: number;
    attached?: boolean;
  };
  supervisor?: {
    academic?: { name?: string };
    field?: { name?: string };
  };
  submission: {
    date?: string;
    monthYear?: string;
  };
  place?: {
    city?: string;
  };
}
