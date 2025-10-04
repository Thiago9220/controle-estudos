import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileDown } from 'lucide-react';

const ExportPDF = ({ subjects, view }) => {
  const exportPdf = () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      html2canvas(input, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;
          const width = pdfWidth;
          const height = width / ratio;

          let position = 0;
          let heightLeft = height;

          pdf.addImage(imgData, 'PNG', 0, position, width, height);
          heightLeft -= pdfHeight;

          while (heightLeft > 0) {
            position = heightLeft - height;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, width, height);
            heightLeft -= pdfHeight;
          }

          pdf.save('meus-estudos.pdf');
        });
    }
  };

  return (
    <button
      onClick={exportPdf}
      className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition flex items-center gap-2 font-medium"
    >
      <FileDown className="w-5 h-5" />
      Exportar para PDF
    </button>
  );
};

export default ExportPDF;
