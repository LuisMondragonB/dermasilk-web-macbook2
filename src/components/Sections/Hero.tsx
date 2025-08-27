import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Star, Users, Award, Shield, Target, Zap } from 'lucide-react';

const Hero = () => {
  const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    const animateCount = () => {
      const target = 1000;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setClientCount(target);
          clearInterval(timer);
        } else {
          setClientCount(Math.floor(current));
        }
      }, duration / steps);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCount();
        observer.disconnect();
      }
    });

    const heroElement = document.getElementById('hero');
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => observer.disconnect();
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      '¡Hola! Vi su promoción de sesión GRATIS de axilas. Me gustaría agendar una cita. ¿Cuándo tienen disponibilidad?'
    );
    window.open(`https://wa.me/524433110777?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.open('tel:+524433110777', '_self');
  };

  return (
    <>
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden hero-fade-in">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e3f4ff] via-white to-[#f5f5f7]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#37b7ff]/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#37b7ff]/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-300/10 rounded-full blur-lg animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-36 h-36 bg-gray-300/10 rounded-full blur-lg animate-float-delayed"></div>
        
        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#37b7ff]/10 text-[#37b7ff] text-sm font-medium mb-8 animate-pulse">
              <span className="w-2 h-2 bg-[#37b7ff] rounded-full mr-2"></span>
              ¡Primera sesión de axilas GRATIS!
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              El sistema de depilación láser
              <br />
              <span className="text-[#37b7ff]">más avanzado a nivel global</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Un toque de luz para una piel perfecta
            </p>
            
            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button
                onClick={handleWhatsAppClick}
                className="bg-[#37b7ff] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2da7ef] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
              >
                <MessageCircle size={20} />
                <span>Agenda tu sesión GRATIS</span>
              </button>
              <div className="text-center">
                <div className="text-sm text-gray-500">Valor</div>
                <div className="text-2xl font-bold line-through text-gray-400">$1,300</div>
                <div className="text-lg font-bold text-green-600">¡GRATIS HOY!</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="text-[#37b7ff]" size={24} />
                <span>Tecnología FDA certificada</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" size={20} />
                  ))}
                </div>
                <span className="font-semibold">5.0</span>
                <span>en Facebook</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="text-[#37b7ff]" size={24} />
                <span>Tecnología certificada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#37b7ff] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#37b7ff] rounded-full mt-2 animate-ping"></div>
          </div>
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#37b7ff]/10 text-[#37b7ff] text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Nuestra Promesa
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Garantías
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Target className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">40% de reducción visible</h3>
              </div>
              <p className="text-gray-600">Desde la primera sesión con tecnología FDA certificada</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Award className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal certificado</h3>
              </div>
              <p className="text-gray-600">En depilación láser profesional con estudios clínicos respaldados</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Zap className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Equipos de última generación</h3>
              </div>
              <p className="text-gray-600">Con mantenimiento constante y tecnología actualizada</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Shield className="text-yellow-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tecnología FDA certificada</h3>
              </div>
              <p className="text-gray-600">Con estudios clínicos respaldados internacionalmente</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;