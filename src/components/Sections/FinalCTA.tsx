import React from 'react';
import { MessageCircle, Instagram, Facebook, Mail, Star, Shield, Award } from 'lucide-react';

const FinalCTA = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      '¡Hola! Quiero agendar mi sesión GRATIS de axilas. ¿Cuál es su disponibilidad?'
    );
    window.open(`https://wa.me/524433110777?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            ¿Lista para una piel perfecta?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a más de 1,000 clientes satisfechos que han transformado su piel
          </p>
          
          {/* Main CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
            <button
              onClick={handleWhatsAppClick}
              className="bg-[#37b7ff] text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-[#2da7ef] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto mb-6"
            >
              <MessageCircle size={24} />
              <span>Agenda por WhatsApp</span>
            </button>
            
            <div className="text-2xl font-bold text-[#37b7ff] mb-4">
              443 311 0777
            </div>
            
            <p className="text-gray-300">
              Respuesta inmediata • Horarios flexibles • Fácil y rápido
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <a
              href="https://instagram.com/dermasilk_laser"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <Instagram className="text-pink-400 group-hover:scale-110 transition-transform" size={24} />
              <span>@dermasilk_laser</span>
            </a>
            <a
              href="https://facebook.com/dermasilk.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <Facebook className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
              <span>dermasilk.mx</span>
            </a>
            <a
              href="mailto:admin@dermasilk.mx"
              className="group flex items-center space-x-3 bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <Mail className="text-purple-400 group-hover:scale-110 transition-transform" size={24} />
              <span>admin@dermasilk.mx</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center space-x-3 bg-white/10 px-6 py-4 rounded-xl">
              <Star className="text-yellow-400" size={24} />
              <span>Sesión de axilas GRATIS</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 px-6 py-4 rounded-xl">
              <Shield className="text-green-400" size={24} />
              <span>Sin compromiso</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 px-6 py-4 rounded-xl">
              <Award className="text-blue-400" size={24} />
              <span>Resultados garantizados</span>
            </div>
          </div>

          {/* Final Message */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-white">Dermasilk®</span>
            </div>
            <p className="text-gray-400 text-sm">
              "Un toque de luz para una piel perfecta"
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Plaza GEA, Morelia, Michoacán • Tecnología certificada internacionalmente
            </p>
            
            {/* Admin Access Button */}
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/login'}
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors duration-200 opacity-50 hover:opacity-100"
              >
                Acceso Administrativo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;