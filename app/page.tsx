import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Safety } from "@/components/sections/Safety";
import { PassengerExperience } from "@/components/sections/PassengerExperience";
import { DriverExperience } from "@/components/sections/DriverExperience";
import { Technology } from "@/components/sections/Technology";
import { Community } from "@/components/sections/Community";
import { Waitlist } from "@/components/sections/Waitlist";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F7F5] overflow-x-hidden">
      {/* 1. Sticky Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Problem Section */}
      <Problem />

      {/* 4. HERDRIVE Solution */}
      <Solution />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Safety System */}
      <Safety />

      {/* 7. Passenger Experience */}
      <PassengerExperience />

      {/* 8. Driver Opportunity */}
      <DriverExperience />

      {/* 9. Technology / Trust */}
      <Technology />

      {/* 10. Community / Trust */}
      <Community />

      {/* 11. Waitlist CTA */}
      <Waitlist />

      {/* 12. Footer */}
      <Footer />
    </main>
  );
}
