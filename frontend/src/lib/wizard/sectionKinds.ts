export interface QuestionDefinition {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "file";
  placeholder?: string;
  required?: boolean;
}

export interface SectionKindConfig {
  kind: string;
  label: string;
  description: string;
  defaultQuestions: QuestionDefinition[];
}

export const SECTION_KINDS_CONFIG: Record<string, SectionKindConfig> = {
  org_background: {
    kind: "org_background",
    label: "Organization Background",
    description: "Background details of host organization, mission, vision, and core activities.",
    defaultQuestions: [
      { key: "org_name", label: "Host Organization Name", type: "text", required: true },
      { key: "org_activities", label: "What does the organization do?", type: "textarea", required: true },
      { key: "org_location", label: "Physical Location & City", type: "text", required: true },
      { key: "org_established", label: "Year Started / Founder Details (if known)", type: "text" },
      { key: "org_vision_mission", label: "Vision & Mission Statement", type: "textarea" },
    ],
  },
  org_structure: {
    kind: "org_structure",
    label: "Organizational Structure",
    description: "Departments, reporting lines, and your placement unit.",
    defaultQuestions: [
      { key: "departments_list", label: "Main Departments & Operational Units", type: "textarea", required: true },
      { key: "attachment_unit", label: "Specific Department/Division You Were Placed In", type: "text", required: true },
      { key: "supervisor_role", label: "Title of your direct supervisor", type: "text" },
    ],
  },
  job_descriptions: {
    kind: "job_descriptions",
    label: "Staff Job Descriptions & Roles",
    description: "Roles of skilled professionals you worked alongside.",
    defaultQuestions: [
      { key: "staff_roles", label: "Roles of skilled staff (work, required skills, education)", type: "textarea", required: true },
    ],
  },
  safety_welfare_policies: {
    kind: "safety_welfare_policies",
    label: "Safety & Welfare Policies",
    description: "Health, safety, recruitment, and welfare rules observed.",
    defaultQuestions: [
      { key: "safety_rules", label: "Occupational safety & health rules observed", type: "textarea", required: true },
      { key: "welfare_policies", label: "Staff welfare and training policies noted", type: "textarea" },
    ],
  },
  objectives: {
    kind: "objectives",
    label: "Objectives & Methodology",
    description: "Your practical objectives and how you gathered knowledge.",
    defaultQuestions: [
      { key: "attachment_objectives", label: "Your primary training objectives", type: "textarea", required: true },
      { key: "knowledge_methodology", label: "Knowledge gathering methods (observation, participation, consulting staff)", type: "textarea", required: true },
    ],
  },
  tasks_activities: {
    kind: "tasks_activities",
    label: "Technical Tasks & Activities",
    description: "Detailed description of tasks, tools, materials, measurements, and photos.",
    defaultQuestions: [
      { key: "tasks_list", label: "Tasks performed with dates/weeks, tools, materials, measurements", type: "textarea", required: true },
    ],
  },
  weekly_summary_table: {
    kind: "weekly_summary_table",
    label: "Weekly Summary Matrix",
    description: "Summary of weekly tasks and lessons learnt row by row.",
    defaultQuestions: [
      { key: "weekly_breakdown", label: "Weekly tasks breakdown (Week 1 to Week 8)", type: "textarea", required: true },
    ],
  },
  challenges: {
    kind: "challenges",
    label: "Challenges & Solutions",
    description: "Problems encountered during attachment and how you handled them.",
    defaultQuestions: [
      { key: "challenges_encountered", label: "Technical or operational problems faced", type: "textarea", required: true },
      { key: "solutions_applied", label: "How you handled and resolved each problem", type: "textarea", required: true },
    ],
  },
  skills_gained: {
    kind: "skills_gained",
    label: "Skills Acquired & Career Effect",
    description: "Technical & soft skills gained, missing skills, and effect on career plans.",
    defaultQuestions: [
      { key: "skills_acquired", label: "Technical and practical skills gained", type: "textarea", required: true },
      { key: "skills_missing", label: "Skills you realized were missing or lacking", type: "textarea" },
      { key: "career_effect", label: "Effect of this attachment on your career plans", type: "textarea" },
    ],
  },
  main_task_problem: {
    kind: "main_task_problem",
    label: "Problem Solving & Proposed Solution",
    description: "Problem statement, solution, assumptions, alternatives, requirements.",
    defaultQuestions: [
      { key: "problem_statement", label: "The core problem identified at the workplace", type: "textarea", required: true },
      { key: "proposed_solution", label: "Your proposed technical solution & justification", type: "textarea", required: true },
      { key: "alternatives_considered", label: "Alternative solutions considered", type: "textarea" },
    ],
  },
  literature_review: {
    kind: "literature_review",
    label: "Literature Review & Theory vs Practice",
    description: "Topic related to your tasks with references & classroom theory comparison.",
    defaultQuestions: [
      { key: "theoretical_concepts", label: "Classroom theories seen in practical application", type: "textarea", required: true },
      { key: "literature_sources", label: "Key academic references or standards consulted", type: "textarea" },
    ],
  },
  conclusion: {
    kind: "conclusion",
    label: "Conclusion & Recommendations",
    description: "Conclusions and recommendations to organization and institution.",
    defaultQuestions: [
      { key: "conclusion_text", label: "General conclusion summary", type: "textarea", required: true },
      { key: "recs_organization", label: "Recommendations to the host organization", type: "textarea", required: true },
      { key: "recs_university", label: "Recommendations to the university/college", type: "textarea", required: true },
    ],
  },
  site_situation: {
    kind: "site_situation",
    label: "Site Situation & Physical Conditions",
    description: "Stage of project, temporary facilities, site conditions, photos.",
    defaultQuestions: [
      { key: "site_conditions", label: "Physical site conditions & temporary facilities", type: "textarea", required: true },
      { key: "project_stage", label: "Stage of the engineering/construction project", type: "text", required: true },
    ],
  },
  abstract: {
    kind: "abstract",
    label: "Abstract / Executive Summary",
    description: "Summary generated from the overall report contents.",
    defaultQuestions: [
      { key: "executive_summary_text", label: "High-level summary of attachment, activities, and key outcomes", type: "textarea", required: true },
    ],
  },
  generic: {
    kind: "generic",
    label: "Custom / Generic Section",
    description: "Free-form section input.",
    defaultQuestions: [
      { key: "generic_input", label: "What should this section cover?", type: "textarea", required: true },
    ],
  },
};

/**
 * Infer section kind from section title using fuzzy keyword matching.
 */
export function inferSectionKind(title: string): string {
  const norm = title.toLowerCase();

  if (norm.includes("abstract") || norm.includes("executive summary")) return "abstract";
  if (norm.includes("background") || norm.includes("profile of host") || norm.includes("introduction")) return "org_background";
  if (norm.includes("structure") || norm.includes("governance") || norm.includes("departmental")) return "org_structure";
  if (norm.includes("job") || norm.includes("role") || norm.includes("staff")) return "job_descriptions";
  if (norm.includes("safety") || norm.includes("welfare") || norm.includes("policy")) return "safety_welfare_policies";
  if (norm.includes("objective") || norm.includes("methodology")) return "objectives";
  if (norm.includes("weekly summary") || norm.includes("logbook matrix")) return "weekly_summary_table";
  if (norm.includes("task") || norm.includes("activity") || norm.includes("practical work") || norm.includes("work done")) return "tasks_activities";
  if (norm.includes("challenge") || norm.includes("problem")) return "challenges";
  if (norm.includes("skill") || norm.includes("career")) return "skills_gained";
  if (norm.includes("solution") || norm.includes("proposed")) return "main_task_problem";
  if (norm.includes("literature") || norm.includes("theory vs") || norm.includes("reflection")) return "literature_review";
  if (norm.includes("conclusion") || norm.includes("recommendation")) return "conclusion";
  if (norm.includes("site") || norm.includes("situation") || norm.includes("topography")) return "site_situation";

  return "generic";
}
