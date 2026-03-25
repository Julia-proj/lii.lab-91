import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Formacion } from "@/components/formacion"
import { StudentResultsGallery } from "@/components/student-results-gallery"
import { FormacionPrivadaBanner } from "@/components/formacion-privada-banner"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Formacion />
      <StudentResultsGallery />
      <FormacionPrivadaBanner />
      <Contact />
      <Footer />
    </main>
  )
}
