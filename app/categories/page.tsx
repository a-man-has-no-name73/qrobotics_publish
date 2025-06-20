"use client"

import Link from "next/link"
import { ShoppingBag, Smartphone, Shirt, Home, Dumbbell, Book, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Latest gadgets, smartphones, computers, and tech accessories",
    icon: Smartphone,
    productCount: 156,
    image: "/placeholder.svg?height=200&width=300",
    color: "bg-blue-500",
    href: "/products?category=electronics",
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Trendy clothing, shoes, and accessories for all styles",
    icon: Shirt,
    productCount: 234,
    image: "/placeholder.svg?height=200&width=300",
    color: "bg-pink-500",
    href: "/products?category=fashion",
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    description: "Everything for your home, kitchen, and outdoor spaces",
    icon: Home,
    productCount: 189,
    image: "/placeholder.svg?height=200&width=300",
    color: "bg-green-500",
    href: "/products?category=home & garden",
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Sports equipment, fitness gear, and outdoor activities",
    icon: Dumbbell,
    productCount: 98,
    image: "/placeholder.svg?height=200&width=300",
    color: "bg-orange-500",
    href: "/products?category=sports",
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    description: "Skincare, makeup, fragrances, and wellness products",
    icon: Sparkles,
    productCount: 145,
    image: "/placeholder.svg?height=200&width=300",
    color: "bg-purple-500",
    href: "/products?category=beauty",
  },
  {
    id: "books",
    name: "Books & Media",
    description: "Books, audiobooks, magazines, and educational content",
    icon: Book,
    productCount: 67,
    image: "/placeholder.svg?height=200&width=300",
    color: "bg-indigo-500",
    href: "/products?category=books",
  },
]

const featuredCategories = [
  {
    name: "New Arrivals",
    description: "Latest products across all categories",
    productCount: 45,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    href: "/products?sort=newest",
  },
  {
    name: "Best Sellers",
    description: "Most popular products this month",
    productCount: 32,
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    href: "/products?sort=bestseller",
  },
  {
    name: "Sale Items",
    description: "Special offers and discounted products",
    productCount: 78,
    color: "bg-gradient-to-r from-red-500 to-orange-500",
    href: "/products?sale=true",
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find exactly what you're looking for with ease.
          </p>
        </div>

        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                  <CardContent className="p-0">
                    <div className={`${category.color} h-32 rounded-t-lg flex items-center justify-center`}>
                      <ShoppingBag className="h-12 w-12 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground mb-3">{category.description}</p>
                      <Badge variant="secondary">{category.productCount} products</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Main Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-6">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link key={category.id} href={category.href}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${category.color} p-3 rounded-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="outline">{category.productCount} products</Badge>
                      </div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">Shop Now →</span>
                        <span className="text-xs text-muted-foreground">Starting from $9.99</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Category Stats */}
        <section className="mt-16 bg-muted/50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Why Shop by Category?</h2>
            <p className="text-muted-foreground">Browse our organized collections to find exactly what you need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0)}+
              </div>
              <p className="text-muted-foreground">Total Products</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{categories.length}</div>
              <p className="text-muted-foreground">Categories</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Customer Support</p>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Navigation</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Link key={category.id} href={category.href}>
                <Badge
                  variant="outline"
                  className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
