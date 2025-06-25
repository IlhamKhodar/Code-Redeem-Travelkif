"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Phone, MapPin, Globe, Instagram } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  name: string
  originalPrice: string
  discountedPrice: string
  category: string
}

const CATEGORY_STYLES: Record<string, string> = {
  "transportasi": "bg-sky-400",
  "tour guide": "bg-slate-600",
  "objek wisata": "bg-amber-400",
}

const CATEGORY_HEADER_STYLES: Record<string, string> = {
  "transportasi": "bg-white text-sky-500",
  "tour guide": "bg-white text-slate-600",
  "objek wisata": "bg-white text-amber-500",
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    voucherCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const formSectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handleRedeemClick = () => {
    document.getElementById("redeem-section")?.scrollIntoView({
      behavior: "smooth",
    })
  }

  // Group products by category
  const groupedProducts = products.reduce<Record<string, Product[]>>((acc, product) => {
    const cat = product.category?.toLowerCase() || "lainnya"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(product)
    return acc
  }, {})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        router.push("/success")
      } else {
        setError(result.error || "Terjadi kesalahan")
      }
    } catch (error) {
      setError("Terjadi kesalahan koneksi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, 
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "transportasi":
        return "bg-sky-400"
      case "tour guide":
        return "bg-slate-600"
      case "objek wisata":
        return "bg-amber-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <head><link rel="icon" href="/travelkifbulat.png" /></head>
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-2">
          <img
            src="/travelkif.png"
            alt="TravelKIF Logo"
            className="h-10 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">Waktunya Menukar</h1>
          <p className="text-4xl">
            <span className="text-sky-500 font-semibold">Ini Dia</span> <span className="text-amber-500">Produk Pilihan</span>{" "}
            <span className="text-gray-800 font-semibold">untuk</span> <span className="text-amber-500">Vouchermu</span>
          </p>
        </div>

        {/* Price Valid Badge */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white border-2 border-gray-300 rounded-full px-6 py-2 text-gray-700 font-medium">
            Price Valid 31/07/2025
          </div>
        </div>

        {/* Products Section - Grouped by Category */}
        <div className="flex flex-col md:flex-row gap-8 justify-center mb-12">
          {["transportasi", "tour guide", "objek wisata"].map((cat) => (
            <div
              key={cat}
              className={`flex-1 rounded-3xl p-6 ${CATEGORY_STYLES[cat]} min-w-[280px] max-w-sm`}
            >
              {/* Category Header */}
              <div className="text-center pb-3">
                <div className={`bg-white text-gray-800 rounded-full px-4 py-1 text-sm font-medium inline-block mx-auto ${CATEGORY_HEADER_STYLES[cat]}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace("guide", "Guide").replace("wisata", "Wisata")}
                </div>
              </div>
              {/* Table Header */}
              <div className="flex font-semibold mb-2 text-white text-base px-2">
                <div className="flex-1">Nama</div>
                <div className="w-20 text-right">Before</div>
                <div className="w-20 text-right">After</div>
              </div>
              {/* Product List */}
              <div className="space-y-1">
                {(groupedProducts[cat] || []).map((product, idx) => (
                  <div key={idx} className="flex items-center text-white px-2">
                    <div className="flex-1 text-left">{product.name}</div>
                    <div className="w-20 text-right text-red-200 font-bold line-through">€ {product.originalPrice}</div>
                    <div className="w-20 text-right font-bold">€ {product.discountedPrice}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Redeem Button */}
        <div className="text-center mb-16">
          <Button
            onClick={handleRedeemClick}
            className="bg-sky-400 hover:bg-sky-500 text-white px-8 py-3 rounded-full text-lg font-medium"
          >
            Redeem Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Redeem Section */}
        <div id="redeem-section" className="grid md:grid-cols-3 gap-8 items-start">
          {/* Background Image */}
          <div className="relative md:col-span-2">
            <img
              src="/cust.jpg?height=600&width=900"
              alt="Milan Cathedral"
              className="w-full object-cover rounded-3xl"
              style={{ height: "100%" }}
            />
          </div>

          {/* Form Section */}
          <div className="space-y-6 md:col-span-1 flex flex-col justify-center"
            style={{ height: "100%" }}
            ref={formSectionRef}
          >
            <div>
              <h2 className="text-3xl font-bold text-amber-500 mb-2">Bonjour!</h2>
              <p className="text-xl text-gray-700">Yuk Redeem Vouchermu!</p>
            </div>

            <Card className="bg-sky-100 border-0 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-gray-700">Isi Data Di bawah</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-600">
                      Nama:
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-white border-0 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-600">
                      No HP:
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-white border-0 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="voucherCode" className="text-gray-600">
                      Kode Voucher:
                    </Label>
                    <Input
                      id="voucherCode"
                      name="voucherCode"
                      placeholder="Masukkan kode voucher (Huruf Kapital)"
                      type="text"
                      value={formData.voucherCode}
                      onChange={handleInputChange}
                      className="bg-white border-0 rounded-lg"
                      required
                    />
                  </div>

                  {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-medium"
                  >
                    {isLoading ? "Processing..." : "Redeem Code"}
                  </Button>
                </form>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-sky-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Contact Us</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+62 813-3151-4151</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      <span>@travelkif</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>travelkif.id</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Tower 88 Casablanca City (Lantai 26F), Jakarta Selatan</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-white font-medium bg-sky-500">
        © Travelkif 2025
      </footer>
    </div>
  )
}
