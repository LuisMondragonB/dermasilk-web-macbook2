import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const TreatmentAreas = () => {
  const [selectedArea, setSelectedArea] = useState('axilas');

  const handleAreaSelection = (areaKey: string) => {
    setSelectedArea(areaKey);
    
    // Scroll automático para mostrar la información del área seleccionada
    setTimeout(() => {
      const areaElement = document.querySelector(`[data-area="${areaKey}"]`);
      if (areaElement) {
        areaElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const areas = {
    face: {
      title: 'Rostro',
      zones: ['Patillas', 'Pómulos', 'Mentón', 'Bigote'],
      price: 'Desde $800',
      sessions: '6, 9 o 12 sesiones'
    },
    body: {
      title: 'Cuerpo',
      zones: ['Cuello', 'Nuca', 'Brazos', '1/2 Brazos', 'Pecho', 'Espalda', 'Abdomen'],
      price: 'Desde $1,200',
      sessions: '6, 9 o 12 sesiones'
    },
    axilas: {
      title: 'Axilas',
      zones: ['Axilas completas'],
      price: '¡GRATIS primera sesión!',
      sessions: '6, 9 o 12 sesiones',
      featured: true
    },
    intimate: {
      title: 'Zona íntima',
      zones: ['Bikini', 'Línea Interglútea', 'Glúteos'],
      price: 'Desde $1,500',
      sessions: '6, 9 o 12 sesiones'
    },
    legs: {
      title: 'Piernas',
      zones: ['Piernas Completas', '1/2 Piernas', 'Pies'],
      price: 'Desde $2,000',
      sessions: '6, 9 o 12 sesiones'
    },
    other: {
      title: 'Otras áreas',
      zones: ['Manos', 'Areolas', 'Línea del Abdomen'],
      price: 'Desde $600',
      sessions: '6, 9 o 12 sesiones'
    }
  };

  const handleWhatsAppClick = (area: string) => {
    const message = encodeURIComponent(
      `¡Hola! Me interesa el tratamiento láser para ${area}. ¿Podrían darme más información sobre precios y disponibilidad?`
    );
    window.open(`https://wa.me/524433110777?text=${message}`, '_blank');
  };

  return (
    <section id="areas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Áreas de tratamiento
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tratamos todas las áreas del cuerpo con tecnología de última generación
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Interactive Body */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#e3f4ff] to-white rounded-3xl p-8 shadow-xl">
              <div className="relative h-96 flex items-center justify-center">
                {/* Clickable Areas */}
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-80">
                    {/* Face */}
                    <button
                      onClick={() => handleAreaSelection('face')}
                      className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                        selectedArea === 'face' 
                          ? 'bg-[#37b7ff] border-[#37b7ff] text-white' 
                          : 'bg-white border-[#37b7ff] text-[#37b7ff] hover:bg-[#37b7ff] hover:text-white'
                      }`}
                    >
                      😊
                    </button>
                    
                    {/* Axilas */}
                    <button
                      onClick={() => handleAreaSelection('axilas')}
                      className={`absolute top-20 left-4 w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedArea === 'axilas' 
                          ? 'bg-[#37b7ff] border-[#37b7ff] animate-pulse' 
                          : 'bg-white border-[#37b7ff] hover:bg-[#37b7ff]'
                      }`}
                    >
                      {selectedArea === 'axilas' && <span className="text-white text-xs">★</span>}
                    </button>
                    
                    <button
                      onClick={() => handleAreaSelection('axilas')}
                      className={`absolute top-20 right-4 w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedArea === 'axilas' 
                          ? 'bg-[#37b7ff] border-[#37b7ff] animate-pulse' 
                          : 'bg-white border-[#37b7ff] hover:bg-[#37b7ff]'
                      }`}
                    >
                      {selectedArea === 'axilas' && <span className="text-white text-xs">★</span>}
                    </button>
                    
                    {/* Body */}
                    <button
                      onClick={() => handleAreaSelection('body')}
                      className={`absolute top-24 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-xl border-2 transition-all duration-200 ${
                        selectedArea === 'body' 
                          ? 'bg-[#37b7ff] border-[#37b7ff]' 
                          : 'bg-white border-[#37b7ff] hover:bg-[#37b7ff]'
                      }`}
                    ></button>
                    
                    {/* Intimate */}
                    <button
                      onClick={() => handleAreaSelection('intimate')}
                      className={`absolute top-44 left-1/2 transform -translate-x-1/2 w-12 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedArea === 'intimate' 
                          ? 'bg-[#37b7ff] border-[#37b7ff]' 
                          : 'bg-white border-[#37b7ff] hover:bg-[#37b7ff]'
                      }`}
                    ></button>
                    
                    {/* Legs */}
                    <button
                      onClick={() => handleAreaSelection('legs')}
                      className={`absolute top-56 left-1/2 transform -translate-x-1/2 w-10 h-20 rounded-full border-2 transition-all duration-200 ${
                        selectedArea === 'legs' 
                          ? 'bg-[#37b7ff] border-[#37b7ff]' 
                          : 'bg-white border-[#37b7ff] hover:bg-[#37b7ff]'
                      }`}
                    ></button>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Haz clic en cualquier área para ver más detalles
                </p>
              </div>
            </div>
          </div>

          {/* Area Details */}
          <div className="space-y-6">
            {Object.entries(areas).map(([key, area]) => (
              <div
                key={key}
                data-area={key}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  selectedArea === key
                    ? 'bg-[#37b7ff]/10 border-2 border-[#37b7ff] shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${area.featured?.ring ? 'ring-2 ring-[#37b7ff] ring-opacity-50' : ''}`}
                onClick={() => handleAreaSelection(key)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {area.title}
                      </h3>
                      {area.featured?.featured && (
                        <span className="px-2 py-1 text-xs bg-[#37b7ff] text-white rounded-full">
                          ¡OFERTA!
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {area.zones.map((zone, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border"
                        >
                          {zone}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-lg font-semibold ${area.featured?.featured ? 'text-[#37b7ff]' : 'text-gray-900'}`}>
                          {area.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          {area.sessions}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppClick(area.title);
                        }}
                        className="bg-[#37b7ff] text-white px-4 py-2 rounded-full hover:bg-[#2da7ef] transition-colors duration-200 flex items-center space-x-2"
                      >
                        <MessageCircle size={16} />
                        <span>Consultar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-[#37b7ff] mb-2">25+</div>
            <p className="text-gray-600">Áreas disponibles</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#37b7ff] mb-2">100%</div>
            <p className="text-gray-600">Todos los tipos de piel</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#37b7ff] mb-2">1ra</div>
            <p className="text-gray-600">Resultados desde sesión</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreatmentAreas;