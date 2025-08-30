import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import MissionSection from '@/components/MissionSection';
import ProgramSection from '@/components/ProgramSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <MissionSection />
        <ProgramSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
