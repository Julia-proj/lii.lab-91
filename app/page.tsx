"use client"

import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Formacion } from "@/components/formacion"
import { Contact } from "@/components/contact"
import { Gallery } from "@/components/gallery"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Formacion />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  )
}
