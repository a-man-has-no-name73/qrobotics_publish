"use client"

import { Suspense } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard"

// Extended product data for the products page
const allProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 99.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 128,
    category: "Electronics",
  },
  {
    id: "2",
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.3,
    reviews: 89,
    category: "Fashion",
  },
  {
    id: "3",
    name: "Smart Home Security Camera",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 203,
    category: "Electronics",
  },
  {
    id: "4",
    name: "Organic Skincare Set",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 156,
    category: "Beauty",
  },
  {
    id: "5",
    name: "Yoga Mat Pro",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 92,
    category: "Sports",
  },
  {
    id: "6",
    name: "Coffee Maker Deluxe",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 267,
    category: "Home & Garden",
  },
  {
    id: "7",
    name: "Running Shoes Ultra",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 178,
    category: "Sports",
  },
  {
    id: "8",
    name: "Bestseller Novel Collection",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.2,
    reviews: 94,
    category: "Books",
  },
  {
    id: "9",
    name: "Wireless Gaming Mouse",
    price: 69.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 145,
    category: "Electronics",
  },
  {
    id: "10",
    name: "Designer Sunglasses",
    price: 159.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 87,
    category: "Fashion",
  },
  {
    id: "11",
    name: "Kitchen Knife Set",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 234,
    category: "Home & Garden",
  },
  {
    id: "12",
    name: "Fitness Tracker Watch",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.3,
    reviews: 312,
    category: "Electronics",
  },
  {
    id: "13",
    name: "Luxury Perfume",
    price: 119.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 98,
    category: "Beauty",
  },
  {
    id: "14",
    name: "Basketball Official Size",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.2,
    reviews: 76,
    category: "Sports",
  },
  {
    id: "15",
    name: "Programming Guide Book",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 189,
    category: "Books",
  },
  {
    id: "16",
    name: "Casual Denim Jacket",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.1,
    reviews: 67,
    category: "Fashion",
  },
]

interface ProductsPageProps {
  searchParams: {
    search?: string
    category?: string
    sort?: string
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const { search, category, sort } = searchParams

  // Filter products based on search and category
  let filteredProducts = allProducts

  if (search) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  }

  // Sort products
  if (sort) {
    switch (sort) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case "reviews":
        filteredProducts.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        // Default sort by name
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  const categories = ["All", "Electronics", "Fashion", "Beauty", "Sports", "Home & Garden", "Books"]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            {search ? `Search results for "${search}"` : "Discover our complete product collection"}
            {filteredProducts.length > 0 && <span className="ml-2">({filteredProducts.length} products found)</span>}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-10"
                      defaultValue={search || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        const url = new URL(window.location.href)
                        if (value) {
                          url.searchParams.set("search", value)
                        } else {
                          url.searchParams.delete("search")
                        }
                        window.history.replaceState({}, "", url.toString())
                        // Trigger a re-render by updating the page
                        setTimeout(() => window.location.reload(), 500)
                      }}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Category Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      defaultValue={category || "all"}
                      onValueChange={(value) => {
                        const url = new URL(window.location.href)
                        if (value === "all") {
                          url.searchParams.delete("category")
                        } else {
                          url.searchParams.set("category", value.toLowerCase())
                        }
                        window.location.href = url.toString()
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Filter */}
                  <Select
                    defaultValue={sort || "name"}
                    onValueChange={(value) => {
                      const url = new URL(window.location.href)
                      url.searchParams.set("sort", value)
                      window.location.href = url.toString()
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {(search || category) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {search && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: {search}
                      <button
                        onClick={() => {
                          const url = new URL(window.location.href)
                          url.searchParams.delete("search")
                          window.location.href = url.toString()
                        }}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {category && category !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {category}
                      <button
                        onClick={() => {
                          const url = new URL(window.location.href)
                          url.searchParams.delete("category")
                          window.location.href = url.toString()
                        }}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                {search ? `No products match your search for "${search}"` : "No products available in this category"}
              </p>
              <Button
                onClick={() => {
                  window.location.href = "/products"
                }}
              >
                View All Products
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
