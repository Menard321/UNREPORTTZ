import { ProfileType } from "./schema";

export interface SelectionParams {
  institutionName: string;
  unitName?: string;
  departmentName?: string;
  programmeName?: string;
  programmeLevel?: string;
  yearOfTraining?: string | number;
  reportTypeKey: string;
}

export interface ResolutionResult {
  profile: ProfileType;
  resolutionStep: 1 | 2 | 3 | 4 | 5 | 6;
  notice?: string;
  isStandardFallback: boolean;
}

/**
 * Standard Fallback Template when no profile matches.
 */
export const STANDARD_FALLBACK_PROFILE: ProfileType = {
  id: "standard-general-report",
  institution: "General",
  scope: {
    faculty: null,
    department: null,
    programmeLevel: null,
    yearOfTraining: null,
  },
  matching: {
    appliesToOtherCoursesOfInstitution: true,
    notice: "Standard Academic Report Template",
  },
  reportTypeKey: "field-training",
  labels: {
    reportName: "Academic Report",
    photoLabel: "Figure",
    figureListTitle: "List of Figures",
    abbreviationsTitle: "List of Abbreviations",
  },
  source: {
    file: "standard-template.pdf",
    kind: "standard",
    pageSize: "A4",
  },
  verification: {
    status: "verified",
    note: "Default standard template for unlisted institutions",
  },
  cover: {
    border: "none",
    labelStyle: "center",
    lines: [
      { field: "institution.name", template: "{institution.name|upper}", style: "bold center 16pt" },
      { field: "unit.name", template: "{unit.name|upper}", style: "bold center 14pt" },
      { field: "department.name", template: "DEPARTMENT OF {department.name|upper}", style: "bold center 12pt" },
      { field: "report.title", template: "{report.title|upper}", style: "bold center 14pt margin-y" },
      { field: "static.by", template: "BY", style: "bold center" },
      { field: "student.name", template: "{student.surnameFirst|upper}", style: "bold center 12pt" },
      { field: "student.regNo", template: "REGISTRATION NO: {student.regNo}", style: "bold center 12pt" },
      { field: "submission.fulfillment", template: "REPORT SUBMITTED IN PARTIAL FULFILLMENT OF THE DEGREE OF {programme.name|upper}", style: "center 11pt margin-y" },
      { field: "submission.monthYear", template: "{submission.monthYear|upper}", style: "bold center 12pt" },
    ],
  },
  frontMatter: [
    { key: "declaration", numbering: "lower_roman", title: "DECLARATION" },
    { key: "acknowledgements", numbering: "lower_roman", title: "ACKNOWLEDGEMENTS" },
    { key: "abstract", numbering: "lower_roman", title: "ABSTRACT" },
    { key: "toc", numbering: "lower_roman", title: "TABLE OF CONTENTS" },
  ],
  chapters: [
    {
      title: "CHAPTER ONE: INTRODUCTION",
      topic: "org_background",
      sections: ["1.1 Background", "1.2 Objectives", "1.3 Organizational Profile"],
    },
    {
      title: "CHAPTER TWO: MAIN ACTIVITIES AND TASKS",
      topic: "tasks_activities",
      sections: ["2.1 Summary of Activities", "2.2 Technical Tasks Performed"],
    },
    {
      title: "CHAPTER THREE: CONCLUSION AND RECOMMENDATIONS",
      topic: "conclusion",
      sections: ["3.1 Conclusion", "3.2 Recommendations"],
    },
  ],
  references: {
    style: "APA",
    note: "Standard APA format",
  },
  appendices: [],
  formatting: {
    measured: true,
    fontFamily: "Times New Roman",
    fontSizeBody: "12pt",
    lineSpacing: "1.5",
    alignment: "justified",
    margins: "Standard 2.5cm",
    pageNumberingFront: "lower_roman",
    pageNumberingBody: "arabic",
  },
};

function normalizeText(val?: string | null): string {
  if (!val) return "";
  return val.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Resolves the matching InstitutionProfile given user selection parameters.
 */
export function resolveProfile(
  params: SelectionParams,
  profiles: ProfileType[]
): ResolutionResult {
  const normInst = normalizeText(params.institutionName);
  const normDept = normalizeText(params.departmentName);
  const normUnit = normalizeText(params.unitName);
  const normLevel = normalizeText(params.programmeLevel);
  const normYear = normalizeText(params.yearOfTraining ? String(params.yearOfTraining) : undefined);
  const normType = normalizeText(params.reportTypeKey);

  // Filter profiles for this institution
  const instProfiles = profiles.filter(
    (p) => normalizeText(p.institution) === normInst || normalizeText(p.id).includes(normInst)
  );

  // Step 1: institution + department + programmeLevel + yearOfTraining + reportTypeKey
  if (normDept && normLevel && normYear) {
    const step1 = instProfiles.find((p) => {
      return (
        normalizeText(p.scope?.department) === normDept &&
        normalizeText(p.scope?.programmeLevel) === normLevel &&
        normalizeText(p.scope?.yearOfTraining) === normYear &&
        normalizeText(p.reportTypeKey) === normType
      );
    });
    if (step1) {
      return { profile: step1, resolutionStep: 1, isStandardFallback: false };
    }
  }

  // Step 2: institution + department + reportTypeKey
  if (normDept) {
    const step2 = instProfiles.find((p) => {
      return (
        normalizeText(p.scope?.department) === normDept &&
        normalizeText(p.reportTypeKey) === normType
      );
    });
    if (step2) {
      return { profile: step2, resolutionStep: 2, isStandardFallback: false };
    }
  }

  // Step 3: institution + unit + reportTypeKey
  if (normUnit) {
    const step3 = instProfiles.find((p) => {
      return (
        normalizeText(p.scope?.faculty) === normUnit &&
        normalizeText(p.reportTypeKey) === normType
      );
    });
    if (step3) {
      return { profile: step3, resolutionStep: 3, isStandardFallback: false };
    }
  }

  // Step 4: Institution general profile for this reportTypeKey
  const step4 = instProfiles.find((p) => normalizeText(p.reportTypeKey) === normType);
  if (step4) {
    return { profile: step4, resolutionStep: 4, isStandardFallback: false };
  }

  // Step 5: Any profile of the same institution (appliesToOtherCoursesOfInstitution: true)
  const step5 = instProfiles.find((p) => p.matching?.appliesToOtherCoursesOfInstitution !== false);
  if (step5) {
    return {
      profile: step5,
      resolutionStep: 5,
      notice:
        "We have a template based on a sample from another course at this institution. The cover uses your own details, but the chapters may differ. Upload your guidelines or use this as a starting point.",
      isStandardFallback: false,
    };
  }

  // Step 6: Standard Fallback Template
  return {
    profile: {
      ...STANDARD_FALLBACK_PROFILE,
      reportTypeKey: params.reportTypeKey || "field-training",
    },
    resolutionStep: 6,
    notice: "Using standard report layout for custom/unlisted institution.",
    isStandardFallback: true,
  };
}
