// Google Apps Script code for Google Sheets integration
// Copy this code to Google Apps Script editor

const ContentService = google.script.runtime.ContentService
const SpreadsheetApp = google.script.runtime.SpreadsheetApp
const google = {} // Declare the google variable to fix the lint error

function doGet(e) {
  const action = e.parameter.action

  if (action === "getProducts") {
    return getProducts()
  } else if (action === "checkVoucher") {
    return checkVoucher(e.parameter.code)
  }

  return ContentService.createTextOutput("Invalid action")
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents)
  const action = data.action

  if (action === "redeemVoucher") {
    return redeemVoucher(data)
  }

  return ContentService.createTextOutput("Invalid action")
}

function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products")
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const products = []

  for (let i = 1; i < data.length; i++) {
    const product = {}
    headers.forEach((header, index) => {
      product[header] = data[i][index]
    })
    products.push(product)
  }

  return ContentService.createTextOutput(JSON.stringify(products)).setMimeType(ContentService.MimeType.JSON)
}

function checkVoucher(code) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vouchers")
  const data = sheet.getDataRange().getValues()

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === code) {
      const isUsed = data[i][2] === "USED"
      return ContentService.createTextOutput(JSON.stringify({ valid: true, used: isUsed })).setMimeType(
        ContentService.MimeType.JSON,
      )
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ valid: false, used: false })).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function redeemVoucher(data) {
  const vouchersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vouchers")
  const redemptionsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Redemptions")

  // Check if voucher exists and is not used
  const voucherData = vouchersSheet.getDataRange().getValues()
  let voucherRow = -1

  for (let i = 1; i < voucherData.length; i++) {
    if (voucherData[i][0] === data.voucherCode) {
      if (voucherData[i][2] === "USED") {
        return ContentService.createTextOutput(
          JSON.stringify({ success: false, error: "Kode sudah ditukar" }),
        ).setMimeType(ContentService.MimeType.JSON)
      }
      voucherRow = i + 1
      break
    }
  }

  if (voucherRow === -1) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: "Kode voucher tidak valid" }),
    ).setMimeType(ContentService.MimeType.JSON)
  }

  // Mark voucher as used
  vouchersSheet.getRange(voucherRow, 3).setValue("USED")
  vouchersSheet.getRange(voucherRow, 4).setValue(new Date())

  // Add redemption record
  redemptionsSheet.appendRow([data.name, data.phone, data.voucherCode, new Date(), "SUCCESS"])

  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON)
}
