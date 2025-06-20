import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { name: "Electronics", icon: "📱", href: "/categories/electronics" },
  { name: "Fashion", icon: "👕", href: "/categories/fashion" },
  { name: "Home & Garden", icon: "🏠", href: "/categories/home-garden" },
  { name: "Sports", icon: "⚽", href: "/categories/sports" },
  { name: "Books", icon: "📚", href: "/categories/books" },
  { name: "Beauty", icon: "💄", href: "/categories/beauty" },
]

export default function Categories() {
  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
