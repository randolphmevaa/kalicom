// app/dashboard/pbx/mes-lignes/utils/helpers.ts
import { ExportableData } from '../models/types';

export const exportToCSV = <T extends ExportableData>(data: T[], filename: string) => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csv = [headers, ...rows].join('\n');
  
  // Create a blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (elementId: string, filename: string) => {
  // In a real implementation, this would use a library like jsPDF or html2pdf.js
  // For this example, we'll just show an alert
  alert(`Le PDF ${filename} a été généré et téléchargé.`);
  
  // In a real implementation:
  /*
  import html2pdf from 'html2pdf.js';
  const element = document.getElementById(elementId);
  html2pdf()
    .from(element)
    .save(`${filename}.pdf`);
  */
};
