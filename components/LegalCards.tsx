'use client'

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, FileText, Lock, Book } from "lucide-react"

const legalDocuments = [
  {
    title: "Terms of Service",
    description: "Our terms and conditions for using our services.",
    icon: FileText,
    href: "/legal/tos",
  },
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information.",
    icon: Lock,
    href: "/legal/privacy",
  },
  {
    title: "End User License Agreement",
    description: "The agreement governing the use of our software.",
    icon: Book,
    href: "/legal/eula",
  },
]

export default function LegalCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {legalDocuments.map((doc) => (
        <a key={doc.title} href={doc.href} className="group">
          <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <doc.icon className="h-8 w-8 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardTitle className="text-xl mb-2">{doc.title}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
          </Card>
        </a>
      ))}
    </div>
  )
}
