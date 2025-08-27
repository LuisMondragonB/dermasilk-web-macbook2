import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, Mail, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      '¡Hola! Me interesa agendar una cita para depilación láser. ¿Cuál es su disponibilidad?'
    );
    window.open(`https://wa.me/524433110777?text=${message}`, '_blank');
  };

  const handleDirectionsClick = () => {
    window.open('https://maps.google.com/?q=Periférico+Paseo+de+la+República+3140+Plaza+GEA+Morelia+Michoacán', '_blank');
  };

  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();
  
  const isOpen = () => {
    if (currentDay === 0) return false; // Domingo cerrado
    if (currentDay === 6) return currentHour >= 10 && currentHour < 17; // Sábado 10-5
    return currentHour >= 9 && currentHour < 20; // Lunes-Viernes 9-8
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Visítanos en Plaza GEA
          </h2>
          <p className="text-xl text-gray-600">
            Estamos ubicados en el corazón de Morelia, Michoacán
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="relative">
            {/* Morelia Location Map */}
            <div className="bg-gradient-to-br from-[#37b7ff]/10 to-[#37b7ff]/20 rounded-3xl shadow-lg overflow-hidden h-80 relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#37b7ff] rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Plaza GEA, Morelia
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Periférico Paseo de la República #3140<br />
                    Morelia, Michoacán 58058
                  </p>
                  <button
                    onClick={handleDirectionsClick}
                    className="bg-[#37b7ff] text-white px-4 py-2 rounded-full hover:bg-[#2da7ef] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto text-sm"
                  >
                    <MapPin size={16} />
                    <span>Ver en Google Maps</span>
                  </button>
                </div>
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-full blur-lg"></div>
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-white/20 rounded-full blur-lg"></div>
            </div>

            {/* Uruapan Location Map */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-3xl shadow-lg overflow-hidden h-80 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Uruapan, Centro
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Abigail Patiño #2 Centro<br />
                    Uruapan, Michoacán 60000
                  </p>
                  <button
                    onClick={() => window.open('https://maps.app.goo.gl/axvwNgnqw1zHnwTNA', '_blank')}
                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto text-sm"
                  >
                    <MapPin size={16} />
                    <span>Ver ubicación</span>
                  </button>
                </div>
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-full blur-lg"></div>
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-white/20 rounded-full blur-lg"></div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Location Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#37b7ff]/10 rounded-xl">
                  <MapPin className="text-[#37b7ff]" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Morelia - Plaza GEA
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Periférico Paseo de la República #3140<br />
                    Plaza GEA, Morelia, Michoacán 58058
                  </p>
                  <button
                    onClick={handleDirectionsClick}
                    className="bg-[#37b7ff] text-white px-4 py-2 rounded-full hover:bg-[#2da7ef] transition-colors duration-200"
                  >
                    Cómo llegar
                  </button>
                </div>
              </div>
            </div>

            {/* Uruapan Location Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#37b7ff]/10 rounded-xl">
                  <MapPin className="text-[#37b7ff]" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Uruapan - Centro
                  </h3>
                  <p className="text-gray-600 mb-4">
                    C. Abigail Patiño #2, Centro<br />
                    Uruapan, Michoacán 60000.
                  </p>
                  <button
                    onClick={() => window.open('https://maps.app.goo.gl/axvwNgnqw1zHnwTNA', '_blank')}
                    className="bg-[#37b7ff] text-white px-4 py-2 rounded-full hover:bg-[#2da7ef] transition-colors duration-200"
                  >
                    Cómo llegar
                  </button>
                </div>
              </div>
            </div>
            
            {/* Hours Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#37b7ff]/10 rounded-xl">
                  <Clock className="text-[#37b7ff]" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Horarios de atención
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Lunes - Viernes</span>
                      <span>10:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábados</span>
                      <span>10:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingos</span>
                      <span>Cerrado</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isOpen() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        isOpen() ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                      {isOpen() ? 'Abierto ahora' : 'Cerrado ahora'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Contáctanos
              </h3>
              <div className="space-y-4">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center space-x-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"
                >
                  <div className="p-2 bg-green-500 rounded-lg">
                    <MessageCircle className="text-white" size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">WhatsApp</div>
                    <div className="text-gray-600">+52 443 311 0777</div>
                  </div>
                </button>

                <a
                  href="tel:+524433110777"
                  className="w-full flex items-center space-x-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
                >
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">Teléfono</div>
                    <div className="text-gray-600">443 311 0777</div>
                  </div>
                </a>

                <a
                  href="mailto:admin@dermasilk.mx"
                  className="w-full flex items-center space-x-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200"
                >
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">admin@dermasilk.mx</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Síguenos en redes
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/dermasilk_laser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl hover:scale-105 transition-transform duration-200"
                >
                  <Instagram className="text-white" size={24} />
                </a>
                <a
                  href="https://facebook.com/dermasilk.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 rounded-xl hover:scale-105 transition-transform duration-200"
                >
                  <Facebook className="text-white" size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;