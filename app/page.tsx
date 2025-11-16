import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { WhatsAppFloat } from '@/components/shared/whatsapp-float'
import { ScrollSpy } from '@/components/shared/scroll-spy'
import { HeroSection } from '@/components/landing/hero-section'
import { PartnerStatsSection } from '@/components/landing/partner-stats-section'
import { EquipmentList } from '@/components/landing/equipment-list'
import { GallerySection } from '@/components/landing/gallery-section'
import { AboutSection } from '@/components/landing/about-section'
import { ContactSection } from '@/components/landing/contact-section'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollSpy />
      <WhatsAppFloat />
      <main className="flex-1">
        <HeroSection />
        <PartnerStatsSection />
        <EquipmentList />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
