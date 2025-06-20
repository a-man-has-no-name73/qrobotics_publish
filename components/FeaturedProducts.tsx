import ProductCard from "./ProductCard"

// Mock data - in a real app, this would come from your database
const featuredProducts = [
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
]

export default function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
