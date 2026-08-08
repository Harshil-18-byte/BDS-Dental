import { DentalLayout } from './components/DentalLayout';
import heroFlowers from './assets/hero-flowers.png';

function App() {
  return (
    <div className="relative w-full bg-black overflow-x-hidden font-sans scroll-smooth">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-black/80">
        <img 
          src={heroFlowers} 
          alt="Dental Clinic Background" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <DentalLayout />
    </div>
  );
}

export default App;
 