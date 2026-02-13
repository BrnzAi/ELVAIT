import jsPDF from 'jspdf';

// Types for the PDF export
interface DimensionScore {
  code: string;
  name: string;
  score: number;
}

interface Flag {
  code: string;
  name: string;
  severity: 'critical' | 'warning' | 'info' | 'CRITICAL' | 'WARN' | 'INFO';
}

interface BlindSpot {
  title: string;
  description: string;
  severity: string;
}

interface ChecklistItem {
  item?: string;
  prompt?: string;
  priority?: string;
  responsibleRole?: string;
  completed?: boolean;
}

export interface PDFExportData {
  title: string;
  recommendation: 'GO' | 'CLARIFY' | 'NO_GO';
  ics: number;
  dimensions: DimensionScore[];
  flags: Flag[];
  blindSpots: BlindSpot[];
  checklist?: ChecklistItem[];
  participantCount?: number;
  responseCount?: number;
  generatedAt?: string;
}

const COLORS = {
  primary: [37, 99, 235] as [number, number, number],     // Blue
  go: [34, 197, 94] as [number, number, number],          // Green
  clarify: [245, 158, 11] as [number, number, number],    // Amber
  nogo: [239, 68, 68] as [number, number, number],        // Red
  gray: [107, 114, 128] as [number, number, number],
  lightGray: [243, 244, 246] as [number, number, number],
  dark: [17, 24, 39] as [number, number, number],
};

export async function exportToPDF(data: PDFExportData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Helper functions
  const addText = (text: string, x: number, yPos: number, options: { 
    size?: number; 
    color?: [number, number, number]; 
    bold?: boolean;
    maxWidth?: number;
  } = {}) => {
    const { size = 10, color = COLORS.dark, bold = false } = options;
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    
    if (options.maxWidth) {
      const lines = pdf.splitTextToSize(text, options.maxWidth);
      pdf.text(lines, x, yPos);
      return lines.length * (size * 0.4);
    }
    pdf.text(text, x, yPos);
    return size * 0.4;
  };

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  const drawRect = (x: number, yPos: number, w: number, h: number, color: [number, number, number], fill = true) => {
    pdf.setFillColor(...color);
    pdf.setDrawColor(...color);
    if (fill) {
      pdf.rect(x, yPos, w, h, 'F');
    } else {
      pdf.rect(x, yPos, w, h, 'S');
    }
  };

  // === HEADER ===
  addText('ELVAIT', margin, y, { size: 24, color: COLORS.primary, bold: true });
  addText('Assessment Report', margin + 32, y, { size: 12, color: COLORS.gray });
  
  const dateStr = data.generatedAt 
    ? new Date(data.generatedAt).toLocaleDateString() 
    : new Date().toLocaleDateString();
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.gray);
  const dateWidth = pdf.getTextWidth(dateStr);
  pdf.text(dateStr, pageWidth - margin - dateWidth, y);
  
  y += 8;
  
  // Title
  addText(data.title, margin, y, { size: 16, bold: true });
  y += 12;
  
  // Divider line
  drawRect(margin, y, contentWidth, 0.5, COLORS.primary);
  y += 10;

  // === RECOMMENDATION & ICS SECTION ===
  const boxHeight = 35;
  const boxWidth = (contentWidth - 10) / 2;
  
  // Recommendation box
  const recColor = data.recommendation === 'GO' ? COLORS.go 
    : data.recommendation === 'CLARIFY' ? COLORS.clarify 
    : COLORS.nogo;
  
  // Light background
  const lightRecColor: [number, number, number] = [
    Math.min(255, recColor[0] + 180),
    Math.min(255, recColor[1] + 180),
    Math.min(255, recColor[2] + 180)
  ];
  drawRect(margin, y, boxWidth, boxHeight, lightRecColor);
  drawRect(margin, y, 3, boxHeight, recColor);
  
  const recLabel = data.recommendation === 'GO' ? 'GO' 
    : data.recommendation === 'CLARIFY' ? 'CLARIFY' 
    : 'NO-GO';
  const recSubtext = data.recommendation === 'GO' ? 'Ready to Proceed'
    : data.recommendation === 'CLARIFY' ? 'Action Required'
    : 'Do Not Proceed';
  
  addText(recLabel, margin + 8, y + 14, { size: 20, color: recColor, bold: true });
  addText(recSubtext, margin + 8, y + 22, { size: 10, color: COLORS.gray });

  // ICS box
  const icsX = margin + boxWidth + 10;
  drawRect(icsX, y, boxWidth, boxHeight, COLORS.lightGray);
  
  addText(data.ics.toString(), icsX + boxWidth/2 - 10, y + 16, { size: 28, color: COLORS.primary, bold: true });
  addText('/100', icsX + boxWidth/2 + 8, y + 16, { size: 12, color: COLORS.gray });
  addText('Investment Clarity Score', icsX + boxWidth/2 - 25, y + 26, { size: 9, color: COLORS.gray });
  
  // ICS progress bar
  const barY = y + 30;
  const barWidth = boxWidth - 16;
  drawRect(icsX + 8, barY, barWidth, 3, [229, 231, 235]);
  const icsColor = data.ics >= 75 ? COLORS.go : data.ics >= 50 ? COLORS.clarify : COLORS.nogo;
  drawRect(icsX + 8, barY, barWidth * (data.ics / 100), 3, icsColor);
  
  y += boxHeight + 15;

  // === DIMENSION SCORES ===
  checkPageBreak(60);
  addText('DIMENSION SCORES', margin, y, { size: 11, color: COLORS.gray, bold: true });
  y += 8;
  
  const dimBoxWidth = (contentWidth - 8) / 3;
  const dimBoxHeight = 28;
  
  data.dimensions.forEach((dim, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    
    if (col === 0 && row > 0) {
      y += dimBoxHeight + 4;
      checkPageBreak(dimBoxHeight + 10);
    }
    
    const dimX = margin + col * (dimBoxWidth + 4);
    const dimY = y;
    
    drawRect(dimX, dimY, dimBoxWidth, dimBoxHeight, COLORS.lightGray);
    
    addText(dim.name, dimX + 4, dimY + 6, { size: 8, color: COLORS.gray });
    addText(dim.score.toString(), dimX + 4, dimY + 16, { size: 16, bold: true });
    addText('/100', dimX + 16, dimY + 16, { size: 8, color: COLORS.gray });
    
    // Score bar
    const scoreColor = dim.score >= 75 ? COLORS.go : dim.score >= 50 ? COLORS.clarify : COLORS.nogo;
    drawRect(dimX + 4, dimY + 22, dimBoxWidth - 8, 2, [229, 231, 235]);
    drawRect(dimX + 4, dimY + 22, (dimBoxWidth - 8) * (dim.score / 100), 2, scoreColor);
  });
  
  // Account for last row
  y += dimBoxHeight + 12;

  // === BLIND SPOTS ===
  if (data.blindSpots.length > 0) {
    checkPageBreak(30);
    addText('BLIND SPOTS & RISKS', margin, y, { size: 11, color: COLORS.gray, bold: true });
    y += 8;
    
    data.blindSpots.forEach(spot => {
      checkPageBreak(20);
      
      const severity = spot.severity.toLowerCase();
      const spotColor = severity === 'critical' ? COLORS.nogo 
        : severity === 'warning' || severity === 'warn' ? COLORS.clarify 
        : COLORS.primary;
      
      drawRect(margin, y, 2, 12, spotColor);
      addText(spot.title, margin + 6, y + 4, { size: 10, bold: true });
      const descHeight = addText(spot.description, margin + 6, y + 10, { 
        size: 8, 
        color: COLORS.gray,
        maxWidth: contentWidth - 10 
      });
      y += 14 + descHeight;
    });
    
    y += 6;
  }

  // === FLAGS ===
  if (data.flags.length > 0) {
    checkPageBreak(25);
    addText(`TRIGGERED FLAGS (${data.flags.length})`, margin, y, { size: 11, color: COLORS.gray, bold: true });
    y += 8;
    
    let flagX = margin;
    data.flags.forEach(flag => {
      const severity = flag.severity.toLowerCase();
      const flagColor = severity === 'critical' ? COLORS.nogo 
        : severity === 'warning' || severity === 'warn' ? COLORS.clarify 
        : COLORS.primary;
      
      const flagText = `${flag.code}: ${flag.name}`;
      pdf.setFontSize(8);
      const flagWidth = pdf.getTextWidth(flagText) + 8;
      
      if (flagX + flagWidth > pageWidth - margin) {
        flagX = margin;
        y += 8;
        checkPageBreak(12);
      }
      
      const lightFlagColor: [number, number, number] = [
        Math.min(255, flagColor[0] + 180),
        Math.min(255, flagColor[1] + 180),
        Math.min(255, flagColor[2] + 180)
      ];
      drawRect(flagX, y - 4, flagWidth, 7, lightFlagColor);
      addText(flagText, flagX + 4, y, { size: 8, color: flagColor, bold: true });
      
      flagX += flagWidth + 4;
    });
    
    y += 12;
  }

  // === CHECKLIST ===
  if (data.checklist && data.checklist.length > 0) {
    checkPageBreak(30);
    addText('ACTION CHECKLIST', margin, y, { size: 11, color: COLORS.gray, bold: true });
    y += 8;
    
    // Table header
    drawRect(margin, y, contentWidth, 7, COLORS.lightGray);
    addText('#', margin + 4, y + 5, { size: 8, bold: true });
    addText('Action Item', margin + 14, y + 5, { size: 8, bold: true });
    addText('Responsible / Priority', pageWidth - margin - 45, y + 5, { size: 8, bold: true });
    y += 9;
    
    data.checklist.slice(0, 10).forEach((item, i) => {
      checkPageBreak(8);
      
      const itemText = item.item || item.prompt || '';
      const responsible = item.responsibleRole || item.priority || '';
      
      if (i % 2 === 1) {
        drawRect(margin, y - 2, contentWidth, 7, [249, 250, 251]);
      }
      
      addText((i + 1).toString(), margin + 4, y + 3, { size: 8 });
      addText(itemText, margin + 14, y + 3, { size: 8, maxWidth: contentWidth - 70 });
      addText(responsible, pageWidth - margin - 45, y + 3, { size: 8, color: COLORS.gray });
      
      y += 7;
    });
    
    y += 6;
  }

  // === FOOTER ===
  const footerY = pageHeight - 15;
  drawRect(margin, footerY - 4, contentWidth, 0.3, COLORS.lightGray);
  
  const footerText = data.responseCount && data.participantCount
    ? `Generated by ELVAIT • ${dateStr} • ${data.responseCount} responses from ${data.participantCount} participants`
    : `Generated by ELVAIT • ${dateStr}`;
  
  pdf.setFontSize(7);
  pdf.setTextColor(...COLORS.gray);
  const footerWidth = pdf.getTextWidth(footerText);
  pdf.text(footerText, pageWidth / 2 - footerWidth / 2, footerY);
  
  pdf.setFontSize(7);
  const confText = 'Confidential — For authorized stakeholders only';
  const confWidth = pdf.getTextWidth(confText);
  pdf.text(confText, pageWidth / 2 - confWidth / 2, footerY + 4);

  // Download
  const fileName = `ELVAIT-${data.title.replace(/[^a-zA-Z0-9]/g, '-')}-${dateStr.replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
}
