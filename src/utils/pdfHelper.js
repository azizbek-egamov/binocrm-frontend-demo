/**
 * PDF fayllarni to'g'ridan-to'g'ri va xavfsiz yuklab olish (download) yordamchi funksiyasi.
 * Brauzer popup blocker'lariga bog'liq bo'lmagan eng ishonchli usul.
 */

export const downloadPdf = (blobData, fileName = "hujjat.pdf") => {
  const blob = new Blob([blobData], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 3000);
};

// Eski importlar xato bermasligi uchun alias:
export const openPdfViewer = (title) => ({
  show: (data) => downloadPdf(data, `${title}.pdf`),
  close: () => {},
});

export const openOrDownloadPdf = (data, fileName) => downloadPdf(data, fileName);
