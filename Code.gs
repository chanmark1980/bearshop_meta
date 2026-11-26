// Code.gs - 貼去 Google Sheets _demo 試算表 → 擴充功能 → Apps Script
// 目標：將網站電郵表格寫入分頁名稱 = Contact

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Contact");
    if (!sheet) {
      // 如果未有 Contact 分頁，自動開一個並加標題列
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Contact");
      sheet.appendRow(["時間", "名字", "電郵", "來源", "頁面", "Timestamp"]);
    }
    var data = e.parameter || {};
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.source || "Bears & Soft Toys - 新產品訂閱",
      data.page || "",
      data.timestamp || ""
    ]);
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Bears & Soft Toys email endpoint is running. POST name + email to save to Contact sheet.");
}
