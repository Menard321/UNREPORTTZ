import { ProfileType, ReportContext } from "../profiles/schema";
import { bindCoverLines } from "../cover/bind";

export interface DocumentExportOptions {
  profile: ProfileType;
  context: ReportContext;
  overrides?: Record<string, string>;
  sectionsContent: { title: string; content: string }[];
}

/**
 * Generates full HTML document markup formatted per profile formatting rules.
 * Suitable for PDF printing and HTML-to-DOCX conversion.
 */
export function generatePrintableHtml(options: DocumentExportOptions): string {
  const { profile, context, overrides, sectionsContent } = options;
  const formatting = profile.formatting || {};
  const fontFamily = formatting.fontFamily || "Times New Roman, serif";
  const fontSize = formatting.fontSizeBody || "12pt";
  const lineSpacing = formatting.lineSpacing || "1.5";
  const alignment = formatting.alignment || "justify";

  const coverConfig = profile.cover || { lines: [], border: "none" };
  const { boundLines } = bindCoverLines(coverConfig.lines, context, overrides);

  const getBorderStyle = () => {
    const border = (coverConfig.border || "none").toLowerCase();
    if (border.includes("double")) return "border: 4px double #000; padding: 40px;";
    if (border.includes("thick") || border.includes("single")) return "border: 2px solid #000; padding: 40px;";
    return "padding: 40px;";
  };

  const coverLinesHtml = boundLines
    .map((line) => {
      const isBold = line.style.includes("bold");
      const isRight = line.style.includes("right");
      const isCenter = line.style.includes("center") || (!isRight && !line.style.includes("left"));
      const textAlign = isRight ? "right" : isCenter ? "center" : "left";
      const fontPt = line.style.includes("16pt")
        ? "20px"
        : line.style.includes("14pt")
        ? "18px"
        : line.style.includes("11pt")
        ? "14px"
        : "16px";

      return `<div style="text-align: ${textAlign}; font-weight: ${
        isBold ? "bold" : "normal"
      }; font-size: ${fontPt}; margin-bottom: 16px; line-height: 1.5;">${line.text}</div>`;
    })
    .join("\n");

  const frontMatterHtml = (profile.frontMatter || [])
    .map(
      (fm, idx) => `
      <div class="page-break"></div>
      <div class="front-matter-section" style="page-break-before: always;">
        <h2 style="text-align: center; text-transform: uppercase; font-size: 14pt; font-weight: bold; margin-bottom: 24px;">${
          fm.title || fm.key.toUpperCase()
        }</h2>
        <p style="text-align: justify; line-height: ${lineSpacing};">[Content for ${fm.title || fm.key}]</p>
      </div>
    `
    )
    .join("\n");

  const bodySectionsHtml = sectionsContent
    .map(
      (sec, idx) => `
      <div class="body-section" style="margin-bottom: 32px;">
        <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin-bottom: 16px;">${sec.title}</h2>
        <div style="text-align: ${alignment}; line-height: ${lineSpacing}; font-size: ${fontSize}; font-family: ${fontFamily};">${sec.content}</div>
      </div>
    `
    )
    .join("\n");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${context.report?.title || "Report"}</title>
      <style>
        @page {
          size: A4;
          margin: 25mm 25mm 25mm 35mm;
        }
        body {
          font-family: ${fontFamily};
          font-size: ${fontSize};
          line-height: ${lineSpacing};
          color: #000;
          background: #fff;
          margin: 0;
          padding: 0;
        }
        .cover-page {
          width: 100%;
          min-height: 270mm;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          page-break-after: always;
          ${getBorderStyle()}
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <!-- Dynamic Cover Page -->
      <div class="cover-page">
        ${coverLinesHtml}
      </div>

      <!-- Front Matter Sections -->
      ${frontMatterHtml}

      <!-- Main Body Content -->
      <div class="page-break"></div>
      <div class="body-content">
        ${bodySectionsHtml}
      </div>
    </body>
    </html>
  `;
}
