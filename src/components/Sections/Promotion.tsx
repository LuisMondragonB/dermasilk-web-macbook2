import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';

const Promotion = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 48,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      '¡Hola! Quiero aprovechar la promoción de la primera sesión de axilas GRATIS. ¿Cuándo tienen disponibilidad?'
    );
    window.open(`https://wa.me/524433110777?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#37b7ff] to-[#2da7ef] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Oferta especial por tiempo limitado
          </div>

          {/* Main Offer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              ¡Tu Primera Sesión de Axilas GRATIS!
            </h2>
            
            {/* Price Display */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className="text-2xl line-through text-white/70">$1,300</span>
              <span className="text-5xl font-bold text-white">$0</span>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                'Sin compromiso de compra',
                'Prueba los resultados por ti mism@',
                'Tecnología de última generación', 
                'Personal certificado'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-green-300" size={20} />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* Countdown Timer */}
            <div className="bg-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="text-yellow-300" size={24} />
                <span className="text-lg font-semibold">Termina en:</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{timeLeft.hours}</div>
                  <div className="text-sm text-white/70">horas</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-sm text-white/70">minutos</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-sm text-white/70">segundos</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleWhatsAppClick}
              className="bg-white text-[#37b7ff] px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
            >
              <MessageCircle size={24} />
              <span>Agenda ahora</span>
            </button>

            <p className="text-white/80 mt-6 text-sm">
              *Oferta válida solo para nuevos clientes. Una sesión por persona.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promotion;