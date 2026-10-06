import { CoverLine } from "./schema";

export interface LintError {
  lineIndex: number;
  template: string;
  reason: string;
}

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

const PROHIBITED_LITERAL_INSTITUTIONS = [
  "university of dar es salaam", "udsm",
  "college of business education", "cbe",
  "institute of finance management", "ifm",
  "national institute of transport", "nit",
  "ardhi university", "aru",
  "sokoine university", "sua",
  "university of dodoma", "udom",
  "mzumbe university", "muhas"
];

const REG_NUMBER_PATTERNS = [
  /\b\d{4}-\d{2}-\d{4,5}\b/i,          // e.g. 2023-04-08219
  /\bBCS\/\d{4}\/\d+\b/i,              // e.g. BCS/2023/123
  /\bREG[\/.:\s]*\d+\b/i               // e.g. REG/12345
];

const FOUR_DIGIT_YEAR_PATTERN = /\b(19|20)\d{2}\b/;

/**
 * Lints a cover line template for forbidden literals.
 * Returns null if valid, or a error reason string if invalid.
 */
export function lintCoverLineTemplate(template: string): string | null {
  if (!template || template.trim() === "") {
    return null;
  }

  // Remove valid tokens e.g. {institution.name|upper} before checking static literals
  const textWithoutTokens = template.replace(/\{[^}]+\}/g, "").trim().toLowerCase();

  // 1. Check prohibited institution / college literals
  for (const inst of PROHIBITED_LITERAL_INSTITUTIONS) {
    if (textWithoutTokens.includes(inst)) {
      return `Contains hard-coded literal institution name or acronym: "${inst}"`;
    }
  }

  // 2. Check registration number patterns in static text
  for (const pattern of REG_NUMBER_PATTERNS) {
    if (pattern.test(textWithoutTokens)) {
      return `Contains a literal registration-number pattern`;
    }
  }

  // 3. Check for literal month names in static text
  for (const month of MONTH_NAMES) {
    const wordBoundaryRegex = new RegExp(`\\b${month}\\b`, "i");
    if (wordBoundaryRegex.test(textWithoutTokens)) {
      return `Contains literal month name: "${month}"`;
    }
  }

  // 4. Check for literal 4-digit year e.g. 2024, 2025, 2026 in static text
  if (FOUR_DIGIT_YEAR_PATTERN.test(textWithoutTokens)) {
    return `Contains literal year number`;
  }

  return null;
}

/**
 * Lints an array of cover lines.
 * Returns array of LintError objects.
 */
export function lintCoverTemplate(lines: CoverLine[]): LintError[] {
  const errors: LintError[] = [];

  lines.forEach((line, index) => {
    const errorReason = lintCoverLineTemplate(line.template);
    if (errorReason) {
      errors.push({
        lineIndex: index,
        template: line.template,
        reason: errorReason,
      });
    }
  });

  return errors;
}
