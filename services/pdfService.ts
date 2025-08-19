
// This assumes html2canvas and jspdf are loaded from a CDN as specified in index.html
declare const html2canvas: any;
declare const jspdf: any;

export const exportResumeToPdf = async (elementId: string, fileName: string): Promise<void> => {
  const resumeElement = document.getElementById(elementId);
  if (!resumeElement) {
    console.error('Resume element not found!');
    return;
  }

  try {
    const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const pdfAspectRatio = pdfWidth / pdfHeight;

    let finalCanvasWidth, finalCanvasHeight;

    // Fit canvas to PDF page
    if (canvasAspectRatio > pdfAspectRatio) {
        finalCanvasWidth = pdfWidth;
        finalCanvasHeight = pdfWidth / canvasAspectRatio;
    } else {
        finalCanvasHeight = pdfHeight;
        finalCanvasWidth = pdfHeight * canvasAspectRatio;
    }

    const x = (pdfWidth - finalCanvasWidth) / 2;
    const y = 0; // Start at the top

    pdf.addImage(imgData, 'PNG', x, y, finalCanvasWidth, finalCanvasHeight);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
