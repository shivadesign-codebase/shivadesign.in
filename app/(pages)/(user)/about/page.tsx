import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, BookOpen, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "About ER. Harsh Verma | Shiva Design Associates | Civil Engineer | Maharajganj",
  description: "Learn about ER. Harsh Verma, Principal Engineer and Founder of Shiva Design Associates, Maharajgnaj. Expertise in structural engineering, vastu compliant architecture, and more.",
  keywords: ["Harsh Verma", "structural engineer", "civil engineering", "Shiva Design Associates", "vastu", "vastu compliant design", "green building", "earthquake resistant structures", "maharajganj"],
};

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About ER. Harsh Verma</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Principal Engineer & Founder of Shiva Design Associates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-6">
                <Image
                  src="/assets/Harsh.jpg?height=400&width=400"
                  alt="ER. Harsh Verma"
                  fill
                  className="object-cover"
                />
              </div>

              <Card className="mb-6">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Contact Information</h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>shivaconsultant97@gmail.com</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>+91 97940 86149</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>Available for consultations</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Maharajganj, Uttar Pradesh</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link href="/contact?subject=Consultation with ER. Harsh Verma">Schedule a Consultation</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="prose max-w-none">
              <h2>Professional Background</h2>

              <p>
                ER. Harsh Verma is the founder and principal engineer of Shiva Design Associates, bringing over 5+ years
                of expertise in civil and structural engineering. After completing his M.Tech in Structural Engineering
                from IIT Delhi, he worked with leading construction firms before establishing his own consultancy in
                2019.
              </p>

              <p>
                His technical proficiency spans structural design, construction management, and innovative engineering
                solutions. ER. Verma has led the design and execution of numerous landmark projects across residential,
                commercial, and infrastructure sectors throughout India.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Areas of Expertise</h3>
                    </div>

                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Badge>Structural Design</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge>Vastu Compliant Architecture</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge>Earthquake Resistant Structures</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge>Green Building Design</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge>Construction Management</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge>Design According To Vastu</Badge>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h2>Professional Philosophy</h2>

              <blockquote className="italic border-l-4 border-primary pl-4 my-6">
                "Engineering is not just about calculations and drawings; it's about creating spaces that enhance human
                lives while respecting the environment. Every structure we design should stand as a testament to both
                technical excellence and thoughtful purpose."
              </blockquote>

              <p>
                ER. Verma's approach to engineering is characterized by a meticulous attention to detail, innovative
                problem-solving, and a commitment to sustainable design principles. He believes in combining traditional
                wisdom with modern technology, as evidenced by his expertise in Vastu-compliant structural designs.
              </p>

              <h2 className="font-bold text-xl mt-4">Notable Projects</h2>
              <ul className="space-y-4 my-6">
                <li className="border-b pb-3">
                  <h4 className="font-medium">
                    City Montessori School
                  </h4>
                  <p className="text-sm text-muted-foreground">Maharajganj</p>
                </li>

                <li className="border-b pb-3">
                  <h4 className="font-medium">Pramila Homeo Clinic</h4>
                  <p className="text-sm text-muted-foreground">Gorakhpur</p>
                </li>

                <li className="border-b pb-3">
                  <h4 className="font-medium">JN Hospital</h4>
                  <p className="text-sm text-muted-foreground">Maharajganj</p>
                </li>
              </ul>

              <p>
                ER. Verma has successfully completed notable projects in various cities, including interior design, Vastu-compliant architecture, 2D and 3D site inspections, and government approvals. His famous projects include City Montessori School in Maharajganj, Pramila Homeo Clinic in Gorakhpur, and JN Hospital in various cities.
              </p>

              <div className="mt-8">
                <Button asChild>
                  <Link href="https://wa.me/919794086149" target="_blank">Contact ER. Harsh Verma</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
