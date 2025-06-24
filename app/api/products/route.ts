import { NextResponse } from "next/server"

const APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsekXdSH6g2Cou3Uz2bAiMmEzIODIDB3OWDoJ5LQ0SxbbNIJbdyQxnezlBkB5ORATM/exec"

export async function GET() {
  try {
    const res = await fetch(APPSCRIPT_URL)
    const data = await res.json()
    // Mapping agar field sesuai dengan frontend
    const mapped = data.map((item: any) => ({
      name: item.Name,
      originalPrice: item.Before,
      discountedPrice: item.After,
      category: item.Category,
    }))
    return NextResponse.json(mapped)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}