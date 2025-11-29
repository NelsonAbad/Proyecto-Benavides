import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoBenavides from 'figma:asset/6a7a77acf51edc1216bbe328deea973abc3f8c76.png';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-benavides-blue to-benavides-red">
      <div className="animate-pulse flex flex-col items-center gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <img src={logoBenavides} alt="Farmacias Benavides" className="h-16 sm:h-20" />
        </div>
        <div className="text-center">
          <p className="text-white/90">Historial Clínico Digital</p>
        </div>
      </div>
      <div className="mt-12">
        <div className="w-48 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};
