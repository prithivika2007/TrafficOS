import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import ConceptMapping from "./components/ConceptMapping.jsx";
import SchedulingStrategies from "./components/SchedulingStrategies.jsx";
import CTASection from "./components/CTASection.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-ink-100">
      <Navbar />
      <main>
        <Hero />
        <ConceptMapping />
        <SchedulingStrategies />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
