import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * Capture a HTML element and export it cleanly to an Executive PDF report.
 * Uses jsPDF and html2canvas for high quality layout capture.
 * @param {string} elementId - ID of the container element to print.
 * @param {string} fileName - Download filename.
 */
export const downloadPDFReport = async (elementId, fileName = "ScanMe_Security_Report.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  // Create a overlay spinner or loader status
  const originalStyle = element.style.cssText;
  
  try {
    // Add temporary styling to optimize layout for rendering
    element.style.background = "#0b0f19"; // dark cyber background
    element.style.padding = "24px";
    element.style.borderRadius = "8px";
    
    // Scale up for high resolution output
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0b0f19",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    
    // PDF Dimensions in mm (A4 size: 210mm x 297mm)
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Multi-page stitching
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF generation failed:", error);
  } finally {
    // Revert temporary styling
    element.style.cssText = originalStyle;
  }
};
