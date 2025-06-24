import { type NextRequest, NextResponse } from "next/server"

const APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsekXdSH6g2Cou3Uz2bAiMmEzIODIDB3OWDoJ5LQ0SxbbNIJbdyQxnezlBkB5ORATM/exec"

export async function POST(request: NextRequest) {
  try {
    const { name, phone, voucherCode } = await request.json()

    // Semua field harus diisi
    if (!name || !phone || !voucherCode) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    // Voucher code harus kapital
    const code = voucherCode.trim()

    // Kirim ke Apps Script
    const res = await fetch(APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, voucherCode: code }),
    })

    const result = await res.json()

    if (result.error) {
      // Jika status 'Sudah' dari Apps Script
      if (result.error.toLowerCase().includes("sudah")) {
        return NextResponse.json({ error: "Kode sudah ditukar" }, { status: 400 })
      }
      // Jika kode tidak valid
      if (result.error.toLowerCase().includes("tidak valid")) {
        return NextResponse.json({ error: "Kode voucher tidak valid" }, { status: 400 })
      }
      // Error lain
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Jika sukses, frontend bisa redirect ke /success
    return NextResponse.json({
      success: true,
      message: "Voucher berhasil ditukar",
    })
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}