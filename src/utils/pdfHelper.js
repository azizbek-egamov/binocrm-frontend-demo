/**
 * PDF ochish va yuklab olish uchun xavfsiz yordamchi funksiyalar.
 * Brauzer Popup Blocker tomonidan window.open bloklanishini oldini oladi.
 */

export const createPreOpenedWindow = (title = "PDF yuklanmoqda...") => {
  try {
    const win = window.open("about:blank", "_blank");
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <style>
              body {
                margin: 0;
                background-color: #0f172a;
                color: #f8fafc;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
              }
              .loader-box {
                text-align: center;
                padding: 30px;
                background: rgba(30, 41, 59, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
              }
              .spinner {
                width: 36px;
                height: 36px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin: 0 auto 16px;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="loader-box">
              <div class="spinner"></div>
              <div style="font-size: 15px; font-weight: 500;">Hujjat tayyorlanmoqda...</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">Iltimos kuting, PDF ochilmoqda</div>
            </div>
          </body>
        </html>
      `);
    }
    return win;
  } catch {
    return null;
  }
};

export const openOrDownloadPdf = (blobData, fileName = "hujjat.pdf", preOpenedWindow = null) => {
  const blob = new Blob([blobData], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  let opened = false;

  // 1. Agar oldindan sinxron ochilgan oyna bo'lsa, unga yo'naltiramiz
  if (preOpenedWindow && !preOpenedWindow.closed) {
    try {
      preOpenedWindow.location.href = url;
      opened = true;
    } catch (e) {
      console.warn("Pre-opened window navigation failed:", e);
    }
  }

  // 2. Agar yo'q bo'lsa, window.open orqali ochishga harakat qilamiz
  if (!opened) {
    try {
      const win = window.open(url, "_blank");
      if (win && !win.closed && typeof win.closed !== "undefined") {
        opened = true;
      }
    } catch (e) {
      console.warn("Direct window.open failed:", e);
    }
  }

  // 3. Agar brauzer popup'ni bloklagan bo'lsa, to'g'ridan-to'g'ri yuklab olish (download) qilamiz
  if (!opened) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
