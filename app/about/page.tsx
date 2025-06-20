import { Users, Award, Truck, Shield, Heart, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=200&width=200",
    description: "Passionate about creating exceptional shopping experiences for our customers.",
  },
  {
    name: "Michael Chen",
    role: "Head of Technology",
    image: "/placeholder.svg?height=200&width=200",
    description: "Leading our tech team to build innovative and user-friendly solutions.",
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Experience Director",
    image: "/placeholder.svg?height=200&width=200",
    description: "Ensuring every customer interaction exceeds expectations.",
  },
  {
    name: "David Kim",
    role: "Product Manager",
    image: "/placeholder.svg?height=200&width=200",
    description: "Curating the best products and managing our diverse catalog.",
  },
]

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Every decision we make is centered around providing the best experience for our customers.",
  },
  {
    icon: Award,
    title: "Quality Products",
    description: "We carefully curate our product selection to ensure only the highest quality items.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Your privacy and security are our top priorities in every transaction.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Serving customers worldwide with fast and reliable shipping solutions.",
  },
]

const stats = [
  { number: "50K+", label: "Happy Customers" },
  { number: "1000+", label: "Products" },
  { number: "25+", label: "Countries Served" },
  { number: "99.9%", label: "Uptime" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About ModernShop</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-purple-100">
              We're passionate about bringing you the best products with exceptional service, creating a shopping
              experience that exceeds your expectations.
            </p>
            <Badge className="bg-white text-purple-600 text-lg px-6 py-2">Trusted by 50,000+ customers worldwide</Badge>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-xl text-muted-foreground">How ModernShop came to be</p>
            </div>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Founded in 2020, ModernShop began as a simple idea: to create an online marketplace that combines the
                convenience of digital shopping with the personal touch of a local store. Our founders, frustrated with
                impersonal shopping experiences, set out to build something different.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                What started as a small team of five has grown into a thriving company serving customers across 25
                countries. We've maintained our core values of quality, customer service, and innovation while scaling
                our operations to meet growing demand.
              </p>
              <p className="text-lg leading-relaxed">
                Today, ModernShop is more than just an eCommerce platform – we're a community of passionate individuals
                dedicated to making online shopping better for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl text-muted-foreground">Numbers that tell our story</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground">What drives us every day</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground">The people behind ModernShop</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose ModernShop?</h2>
              <p className="text-xl text-muted-foreground">What sets us apart from the competition</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Truck className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Fast & Free Shipping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Free shipping on orders over $50 with express delivery options available. Most orders arrive within
                    2-3 business days.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Secure Shopping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your personal and payment information is protected with industry-leading SSL encryption and secure
                    payment processing.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our dedicated customer support team is available around the clock to help with any questions or
                    concerns you may have.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl mb-8 text-purple-100">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-purple-100">support@modernshop.com</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-purple-100">1-800-MODERN-SHOP</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-purple-100">Available 24/7</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
