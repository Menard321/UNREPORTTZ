import { CoverLine, ReportContext } from "../profiles/schema";

const ROMAN_NUMERALS: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII"
};

const NUMBER_WORDS: Record<number, string> = {
  1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight"
};

/**
 * Converts a string to Title Case safely handling apostrophes and hyphens.
 */
export function toTitleCase(str: string): string {
  if (!str) return "";
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

/**
 * Converts numeric value or string number to Roman Numeral.
 */
export function toRoman(val: string | number | undefined): string {
  if (!val) return "";
  const num = typeof val === "number" ? val : parseInt(String(val).replace(/\D/g, ""), 10);
  if (isNaN(num)) return String(val);
  return ROMAN_NUMERALS[num] || String(num);
}

/**
 * Converts numeric value or string number to Word form (e.g. 3 -> Three).
 */
export function toWords(val: string | number | undefined): string {
  if (!val) return "";
  const num = typeof val === "number" ? val : parseInt(String(val).replace(/\D/g, ""), 10);
  if (isNaN(num)) return String(val);
  return NUMBER_WORDS[num] || String(num);
}

/**
 * Formats full student name as "SURNAME, Other Names"
 */
export function buildSurnameFirst(surname: string, otherNames: string): string {
  const cleanSurname = (surname || "").trim();
  const cleanOther = (otherNames || "").trim();
  if (cleanSurname && cleanOther) {
    return `${cleanSurname.toUpperCase()}, ${cleanOther}`;
  }
  return cleanSurname ? cleanSurname.toUpperCase() : cleanOther;
}

/**
 * Reads nested field path from ReportContext object safely.
 */
export function getContextValue(context: ReportContext, path: string): { value: string | undefined; fieldLabel: string } {
  const normalizedPath = path.trim();

  // Synthetic / derived fields
  if (normalizedPath === "student.surnameFirst" || normalizedPath === "student.name") {
    const val = buildSurnameFirst(context.student?.surname, context.student?.otherNames);
    return { value: val || undefined, fieldLabel: "Student Name" };
  }

  if (normalizedPath === "student.yearRoman") {
    const val = context.student?.yearRoman || toRoman(context.student?.yearOfStudy);
    return { value: val || undefined, fieldLabel: "Year of Study" };
  }

  if (normalizedPath === "student.yearWords") {
    const val = context.student?.yearWords || toWords(context.student?.yearOfStudy);
    return { value: val || undefined, fieldLabel: "Year of Study" };
  }

  // Path resolution
  const parts = normalizedPath.split(".");
  let current: any = context;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  const fieldLabels: Record<string, string> = {
    "institution.name": "Institution Name",
    "unit.name": "College / School Name",
    "department.name": "Department Name",
    "programme.name": "Programme / Course Name",
    "student.regNo": "Registration Number",
    "submission.monthYear": "Submission Date",
    "report.title": "Report Title",
    "academicYear": "Academic Year",
  };

  return {
    value: current !== undefined && current !== null && current !== "" ? String(current) : undefined,
    fieldLabel: fieldLabels[normalizedPath] || normalizedPath.split(".").pop() || "Field"
  };
}

/**
 * Binds tokenized template line using context values and formatters.
 */
export function bindTokenTemplate(
  template: string,
  context: ReportContext,
  overrides?: Record<string, string>
): { text: string; hasMissingValue: boolean; missingFields: string[] } {
  if (!template) {
    return { text: "", hasMissingValue: false, missingFields: [] };
  }

  let hasMissingValue = false;
  const missingFields: string[] = [];

  const text = template.replace(/\{([^}]+)\}/g, (_, tokenExpr: string) => {
    const [rawPath, formatter] = tokenExpr.split("|").map(s => s.trim());

    // Check manual field override first
    let val: string | undefined = overrides?.[rawPath];
    let label = rawPath;

    if (!val) {
      const resolved = getContextValue(context, rawPath);
      val = resolved.value;
      label = resolved.fieldLabel;
    }

    if (!val || val.trim() === "") {
      hasMissingValue = true;
      if (!missingFields.includes(label)) {
        missingFields.push(label);
      }
      return `[${label}]`;
    }

    // Apply formatters
    if (formatter === "upper") {
      val = val.toUpperCase();
    } else if (formatter === "title") {
      val = toTitleCase(val);
    } else if (formatter === "roman") {
      val = toRoman(val);
    } else if (formatter === "words") {
      val = toWords(val);
    }

    return val;
  });

  return { text, hasMissingValue, missingFields };
}

/**
 * Binds an entire CoverLine array against a ReportContext.
 */
export interface BoundCoverLine {
  field: string;
  template: string;
  text: string;
  style: string;
  addedByReportWise?: boolean;
  hasMissingValue: boolean;
  missingFields: string[];
}

export function bindCoverLines(
  lines: CoverLine[],
  context: ReportContext,
  overrides?: Record<string, string>
): { boundLines: BoundCoverLine[]; missingRequiredFields: string[] } {
  const boundLines: BoundCoverLine[] = [];
  const missingRequiredFields: string[] = [];

  lines.forEach((line) => {
    const bound = bindTokenTemplate(line.template, context, overrides);
    boundLines.push({
      field: line.field,
      template: line.template,
      text: bound.text,
      style: line.style,
      addedByReportWise: line.addedByReportWise,
      hasMissingValue: bound.hasMissingValue,
      missingFields: bound.missingFields,
    });

    bound.missingFields.forEach(mf => {
      if (!missingRequiredFields.includes(mf)) {
        missingRequiredFields.push(mf);
      }
    });
  });

  return { boundLines, missingRequiredFields };
}
