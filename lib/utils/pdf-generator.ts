// PDF Generation Utility for Research Reports
export interface PDFGenerationOptions {
  title: string;
  content: string;
  metadata?: {
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
  };
  styling?: {
    fontSize?: number;
    fontFamily?: string;
    pageSize?: 'A4' | 'Letter';
    margins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
}

export const generatePDFReport = async (options: PDFGenerationOptions): Promise<Blob> => {
  const {
    title,
    content,
    metadata = {},
    styling = {}
  } = options;

  // Default styling options
  const defaultStyling = {
    fontSize: 12,
    fontFamily: 'Arial, sans-serif',
    pageSize: 'A4' as const,
    margins: {
      top: 72,
      right: 72,
      bottom: 72,
      left: 72
    }
  };

  const finalStyling = { ...defaultStyling, ...styling };

  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Unable to open print window. Please check your browser settings.');
  }

  // Generate PDF-ready HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        ${generatePDFStyles(finalStyling)}
      </style>
    </head>
    <body>
      <div class="pdf-container">
        <header class="pdf-header">
          <h1 class="pdf-title">${title}</h1>
          <div class="pdf-metadata">
            <p>Generated: ${new Date().toLocaleDateString()}</p>
            ${metadata.author ? `<p>Author: ${metadata.author}</p>` : ''}
            <p>Source: TMS MasterFilmon Research</p>
          </div>
        </header>
        <main class="pdf-content">
          ${content}
        </main>
        <footer class="pdf-footer">
          <p>© ${new Date().getFullYear()} TMS MasterFilmon Research. All rights reserved.</p>
          <p>Generated from tms.masterfilmon.com</p>
        </footer>
      </div>
    </body>
    </html>
  `;

  // Write content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };

  // For client-side PDF generation (if needed)
  return new Blob([htmlContent], { type: 'text/html' });
};

const generatePDFStyles = (styling: any): string => {
  return `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: ${styling.fontFamily};
      font-size: ${styling.fontSize}px;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }

    .pdf-container {
      max-width: 210mm;
      margin: 0 auto;
      padding: ${styling.margins.top}px ${styling.margins.right}px ${styling.margins.bottom}px ${styling.margins.left}px;
      min-height: 297mm;
      position: relative;
    }

    .pdf-header {
      border-bottom: 2px solid #3182ce;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .pdf-title {
      font-size: 24px;
      font-weight: bold;
      color: #1a202c;
      margin-bottom: 10px;
    }

    .pdf-metadata {
      font-size: 10px;
      color: #666;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .pdf-metadata p {
      margin: 0;
    }

    .pdf-content {
      margin-bottom: 40px;
    }

    .pdf-content h1 {
      font-size: 20px;
      font-weight: bold;
      color: #1a202c;
      margin: 20px 0 10px 0;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
    }

    .pdf-content h2 {
      font-size: 16px;
      font-weight: bold;
      color: #2d3748;
      margin: 16px 0 8px 0;
    }

    .pdf-content h3 {
      font-size: 14px;
      font-weight: bold;
      color: #4a5568;
      margin: 12px 0 6px 0;
    }

    .pdf-content p {
      margin: 8px 0;
      text-align: justify;
    }

    .pdf-content ul, .pdf-content ol {
      margin: 8px 0 8px 20px;
    }

    .pdf-content li {
      margin: 4px 0;
    }

    .pdf-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }

    .pdf-content table th,
    .pdf-content table td {
      border: 1px solid #e2e8f0;
      padding: 8px;
      text-align: left;
    }

    .pdf-content table th {
      background-color: #f7fafc;
      font-weight: bold;
    }

    .pdf-content .highlight {
      background-color: #fff3cd;
      padding: 2px 4px;
      border-radius: 3px;
    }

    .pdf-content .important {
      background-color: #f8d7da;
      padding: 10px;
      border-radius: 5px;
      border-left: 4px solid #dc3545;
      margin: 10px 0;
    }

    .pdf-content .note {
      background-color: #d1ecf1;
      padding: 10px;
      border-radius: 5px;
      border-left: 4px solid #17a2b8;
      margin: 10px 0;
    }

    .pdf-footer {
      position: absolute;
      bottom: ${styling.margins.bottom}px;
      left: ${styling.margins.left}px;
      right: ${styling.margins.right}px;
      text-align: center;
      font-size: 10px;
      color: #666;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }

    .pdf-footer p {
      margin: 2px 0;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .pdf-container {
        margin: 0;
        padding: 0;
        max-width: none;
        width: 100%;
      }

      .pdf-header {
        page-break-inside: avoid;
      }

      .pdf-content h1,
      .pdf-content h2,
      .pdf-content h3 {
        page-break-after: avoid;
      }

      .pdf-content table {
        page-break-inside: avoid;
      }

      .pdf-footer {
        position: fixed;
        bottom: 0;
      }
    }

    @page {
      size: ${styling.pageSize};
      margin: ${styling.margins.top}px ${styling.margins.right}px ${styling.margins.bottom}px ${styling.margins.left}px;
    }
  `;
};

export const formatContentForPDF = (content: any): string => {
  // Convert research data to HTML format suitable for PDF
  if (typeof content === 'string') {
    return content;
  }

  if (typeof content === 'object' && content !== null) {
    let html = '';
    
    if (content.keyFindings) {
      html += '<h1>Key Findings</h1>';
      html += '<ul>';
      content.keyFindings.forEach((finding: string) => {
        html += `<li>${finding}</li>`;
      });
      html += '</ul>';
    }

    if (content.therapeuticBenefits) {
      html += '<h1>Therapeutic Benefits</h1>';
      html += '<table>';
      html += '<tr><th>Condition</th><th>Effectiveness</th><th>Study Size</th><th>Timeframe</th></tr>';
      content.therapeuticBenefits.forEach((benefit: any) => {
        html += `<tr>
          <td>${benefit.condition}</td>
          <td>${benefit.effectiveness}</td>
          <td>${benefit.studySize}</td>
          <td>${benefit.timeframe}</td>
        </tr>`;
      });
      html += '</table>';
    }

    if (content.safetyProfile) {
      html += '<h1>Safety Profile</h1>';
      html += '<h2>Common Side Effects</h2>';
      html += '<ul>';
      content.safetyProfile.commonSideEffects.forEach((effect: string) => {
        html += `<li>${effect}</li>`;
      });
      html += '</ul>';
      
      html += '<h2>Contraindications</h2>';
      html += '<ul>';
      content.safetyProfile.contraindications.forEach((contraindication: string) => {
        html += `<li>${contraindication}</li>`;
      });
      html += '</ul>';
    }

    return html;
  }

  return '';
};