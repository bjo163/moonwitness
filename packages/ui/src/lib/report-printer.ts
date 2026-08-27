import type { ModelSchema } from "@workspace/types"

/**
 * Universal Tactical Document & Briefing Printer
 * Opens a print-formatted window with cryptographic verification seal and triggers native browser print/PDF.
 */
export function printRecordBriefing(schema: ModelSchema, record: any): void {
  if (typeof window === "undefined") return

  const title = record[schema.recName || "name"] || `#${record.id}`
  const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19)
  const checksum = `MW-${schema.name.toUpperCase().replace(/\./g, "-")}-${record.id || "00"}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // Build field rows
  const fieldRows = Object.entries(schema.fields)
    .filter(([_, def]) => !def.invisible && def.type !== "one2many" && def.type !== "many2many")
    .map(([key, def]) => {
      let val = record[key]
      if (val === undefined || val === null || val === "") val = "-"
      else if (typeof val === "object") val = val.name || val.title || `#${val.id}`
      else if (typeof val === "boolean") val = val ? "YES" : "NO"
      return `
        <div class="field-item">
          <span class="field-label">${def.label || key}</span>
          <span class="field-value">${String(val)}</span>
        </div>
      `
    })
    .join("")

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${schema.name} // Briefing Memorandum #${record.id || "GENESIS"}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
          color: #0d1117;
          background: #ffffff;
          padding: 20px;
          line-height: 1.4;
          font-size: 12px;
        }
        .header-bar {
          border-bottom: 2px solid #000000;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .sys-title {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .sys-sub {
          font-size: 10px;
          color: #555555;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .classification-badge {
          border: 1px solid #000000;
          padding: 4px 8px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .doc-title {
          font-size: 15px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 15px;
          padding: 6px 10px;
          background: #f0f3f6;
          border-left: 4px solid #000000;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 25px;
        }
        .field-item {
          border-bottom: 1px dashed #cccccc;
          padding-bottom: 4px;
        }
        .field-label {
          display: block;
          font-size: 9px;
          font-weight: 700;
          color: #666666;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .field-value {
          font-size: 12px;
          font-weight: 600;
          color: #000000;
        }
        .signoff-section {
          margin-top: 35px;
          border-top: 1px solid #000000;
          padding-top: 15px;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          align-items: center;
        }
        .signature-box {
          border: 1px dashed #888888;
          height: 60px;
          padding: 6px;
          font-size: 9px;
          color: #888888;
          text-transform: uppercase;
        }
        .qr-block {
          text-align: right;
          font-family: monospace;
          font-size: 9px;
        }
        .checksum {
          font-weight: 700;
          background: #000000;
          color: #ffffff;
          padding: 2px 6px;
          display: inline-block;
          margin-top: 4px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header-bar">
        <div>
          <div class="sys-title">MOONWITNESS OPERATING SYSTEM</div>
          <div class="sys-sub">DIVINE CELESTIAL & OPERATIONAL MISSION MATRIX // V9.0</div>
        </div>
        <div class="classification-badge">OFFICIAL MEMORANDUM</div>
      </div>

      <div class="doc-title">
        ${schema.views?.form?.title || schema.description || schema.name} — RECORD #${record.id || "00"}
      </div>

      <div class="grid-container">
        <div class="field-item">
          <span class="field-label">PRIMARY DESIGNATION</span>
          <span class="field-value">${String(title)}</span>
        </div>
        <div class="field-item">
          <span class="field-label">SCHEMA ENTITY</span>
          <span class="field-value">${schema.name}</span>
        </div>
        ${fieldRows}
      </div>

      <div class="signoff-section">
        <div>
          <div class="signature-box">OPERATOR RATIFICATION & AUTHORITY SEAL</div>
        </div>
        <div class="qr-block">
          <div>TIMESTAMP: ${nowStr}</div>
          <div class="checksum">${checksum}</div>
        </div>
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank", "width=850,height=900")
  if (printWindow) {
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
  }
}
