/**
 * 熊熊與毛絨公仔小店 — Google Apps Script (GAS) 電郵收集後端
 * 對應 Google Drive 位置：_demo / Contact（Google 試算表）
 *
 * 安裝方式（建議使用「繫結試算表」方式，最簡單不易出錯）：
 * 1. 在 Google Drive 開啟資料夾「_demo」，建立或開啟名為「Contact」的 Google 試算表。
 * 2. 點選上方選單「擴充功能」>「Apps Script」。
 * 3. 將此檔案的所有程式碼貼上並儲存。
 * 4. 點選右上角「部署」>「新增部署」> 類型選「網頁應用程式」。
 *    - 執行身分：我
 *    - 誰可以存取：所有人
 * 5. 複製產生的「網頁應用程式網址」，貼到網站 js/main.js 的 GAS_WEB_APP_URL。
 */

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Bear & Soft Toys Contact GAS Web App is running.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // 取得目前繫結的「Contact」試算表與第一個工作表
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // 若使用獨立 Apps Script 專案，可改用下方這行並填入試算表網址中的 ID：
    // var ss = SpreadsheetApp.openById('請貼上_Contact_試算表_ID');

    var sheet = ss.getSheets()[0];

    // 若試算表為空，自動建立標題列
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['提交時間 (HKT)', '電郵地址', '來源頁面']);
      sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
    }

    // 解析前端傳來的 JSON 資料
    var rawData = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(rawData);
    var email = (data.email || '').toString().trim();
    var page = (data.page || 'unknown').toString().trim();

    if (!email || email.indexOf('@') === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: '請輸入有效的電郵地址' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 以香港時間 (UTC+8) 寫入一列新資料
    var timestamp = Utilities.formatDate(new Date(), 'Asia/Hong_Kong', 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([timestamp, email, page]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: '已成功儲存至 Contact 試算表' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
