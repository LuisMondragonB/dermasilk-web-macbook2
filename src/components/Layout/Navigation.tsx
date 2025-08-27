import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    // Cerrar menú móvil si está abierto
    setIsMobileMenuOpen(false);
    // Si estamos en la página de inicio, hacer scroll suave al hero
    if (location.pathname === '/') {
      const element = document.getElementById('hero');
      if (element) {
        // Reset and trigger hero animation
        element.classList.remove('hero-fade-in', 'hero-fade-in-trigger');
        element.classList.add('hero-fade-in-trigger');
        
        // Crear efecto rebote siempre
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }, 50);
      }
    } else {
      // Si estamos en otra página, navegar al inicio y luego hacer scroll al hero
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('hero');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 200);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 200);
    } else {
      const element = document.getElementById(sectionId);
      if (element && sectionId === 'hero') {
        // Reset and trigger hero animation
        element.classList.remove('hero-fade-in', 'hero-fade-in-trigger');
        element.classList.add('hero-fade-in-trigger');
        
        // Para el hero, crear efecto rebote siempre
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }, 50);
      } else if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      '¡Hola! Vi su promoción de sesión GRATIS de axilas. Me gustaría agendar una cita. ¿Cuándo tienen disponibilidad?'
    );
    window.open(`https://wa.me/524433110777?text=${message}`, '_blank');
  };

  const handleMembershipsClick = () => {
    setIsMobileMenuOpen(false);
    if (location.pathname === '/membresias') {
      // Si ya estamos en la página de membresías, hacer scroll suave al hero
      const element = document.getElementById('hero');
      if (element) {
        // Reset and trigger hero animation
        element.classList.remove('hero-fade-in', 'hero-fade-in-trigger');
        element.classList.add('hero-fade-in-trigger');
        
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    } else {
      // Si estamos en otra página, navegar y luego hacer scroll
      navigate('/membresias');
      setTimeout(() => {
        const element = document.getElementById('hero');
        if (element) {
          // Reset and trigger hero animation
          element.classList.remove('hero-fade-in', 'hero-fade-in-trigger');
          element.classList.add('hero-fade-in-trigger');
          
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 200);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg w-screen max-w-full mobile-nav-fix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200 flex items-center z-10 min-w-0"
          >
            <span className="text-2xl font-bold text-black">Derma</span>
            <span className="text-2xl font-bold text-[#37b7ff]">silk</span>
            <span className="text-xs font-normal text-gray-500 ml-1">®</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:block flex-1">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-gray-700 hover:text-[#37b7ff] transition-colors duration-200"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('what-is')}
                className="text-gray-700 hover:text-[#37b7ff] transition-colors duration-200"
              >
                ¿Qué es?
              </button>
              <button 
                onClick={() => scrollToSection('benefits')}
                className="text-gray-700 hover:text-[#37b7ff] transition-colors duration-200"
              >
                Beneficios
              </button>
              <button 
                onClick={() => scrollToSection('areas')}
                className="text-gray-700 hover:text-[#37b7ff] transition-colors duration-200"
              >
                Áreas
              </button>
              <button 
                onClick={() => scrollToSection('care')}
                className="text-gray-700 hover:text-[#37b7ff] transition-colors duration-200"
              >
                Cuidados
              </button>
              <button 
                onClick={handleMembershipsClick}
                className="text-gray-700 hover:text-[#37b7ff] transition-colors duration-200"
              >
                Membresías
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-[#37b7ff] transition-colors duration-200"
              >
                Contacto
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={handleWhatsAppClick}
              className="bg-[#37b7ff] text-white px-6 py-2 rounded-full hover:bg-[#2da7ef] transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <MessageCircle size={16} />
              <span>Axilas GRATIS</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center z-50 flex-shrink-0 ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-[#37b7ff] p-2 z-50 relative bg-white rounded-md border border-gray-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg fixed top-16 left-0 right-0 z-40 w-screen max-w-full">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#37b7ff] hover:bg-gray-50 rounded-md"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('what-is')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#37b7ff]"
            >
              ¿Qué es?
            </button>
            <button 
              onClick={() => scrollToSection('benefits')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#37b7ff]"
            >
              Beneficios
            </button>
            <button 
              onClick={() => scrollToSection('areas')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#37b7ff]"
            >
              Áreas
            </button>
            <button 
              onClick={() => scrollToSection('care')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#37b7ff]"
            >
              Cuidados
            </button>
            <button 
              onClick={handleMembershipsClick}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#37b7ff]"
            >
              Membresías
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#37b7ff]"
            >
              Contacto
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-[#37b7ff] text-white px-4 py-2 rounded-full hover:bg-[#2da7ef] transition-all duration-200 mt-4 flex items-center justify-center space-x-2"
            >
              <MessageCircle size={16} />
              <span>Axilas GRATIS</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;