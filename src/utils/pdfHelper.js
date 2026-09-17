/**
 * PDF fayllarni yuklab olmasdan, yangi tabda Blob asosida to'liq ekranda ochish.
 * Brauzer Popup Blocker bloklashini oldini olish uchun oyna foydalanuvchi bosishi bilanoq ochiladi.
 */

export const openPdfViewer = (title = "Hujjat") => {
  let newTab = null;
  try {
    newTab = window.open("about:blank", "_blank");
    if (newTab) {
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title} - Yuklanmoqda...</title>
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
              @keyframes spin { to { transform: rotate(360deg); } }
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
  } catch (e) {
    console.warn("Could not pre-open window:", e);
  }

  return {
    show: (blobData) => {
      const blob = new Blob([blobData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      if (newTab && !newTab.closed) {
        try {
          newTab.document.open();
          newTab.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>${title}</title>
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background-color: #525659;
                  }
                  iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    display: block;
                  }
                </style>
              </head>
              <body>
                <iframe src="${url}" type="application/pdf"></iframe>
              </body>
            </html>
          `);
          newTab.document.close();
          return;
        } catch (err) {
          console.warn("Failed to write iframe to newTab:", err);
        }
      }

      // Fallback agar popup dastlab ochilmagan bo'lsa
      window.open(url, "_blank");
    },
    close: () => {
      if (newTab && !newTab.closed) {
        newTab.close();
      }
    },
  };
};
