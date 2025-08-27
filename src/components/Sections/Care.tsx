import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sun, Rat as Razor, AlertTriangle, Droplets, Shield, Shirt } from 'lucide-react';

const Care = () => {
  const [activeSection, setActiveSection] = useState('pre');

  const careInstructions = {
    pre: {
      title: 'Antes de tu sesión',
      icon: Shield,
      instructions: [
        {
          icon: Sun,
          text: 'Evitar sol o rayos UVA 15 días antes',
          detail: 'La exposición solar puede aumentar el riesgo de manchas y complicaciones'
        },
        {
          icon: Razor,
          text: 'Rasurar la zona 24 horas antes',
          detail: 'El vello debe estar corto para que el láser sea más efectivo'
        },
        {
          icon: Droplets,
          text: 'Acudir con piel limpia, sin cremas',
          detail: 'Evita lociones, perfumes o desodorantes en la zona a tratar'
        },
        {
          icon: AlertTriangle,
          text: 'Informar sobre medicamentos',
          detail: 'Algunos medicamentos pueden causar fotosensibilidad'
        }
      ],
      warning: '⚠️ Contraindicado en embarazo y fotosensibilidad'
    },
    post: {
      title: 'Después de tu sesión',
      icon: Shield,
      instructions: [
        {
          icon: Sun,
          text: 'Usar protector solar FPS 50+',
          detail: 'Es fundamental para prevenir manchas en la piel tratada'
        },
        {
          icon: Droplets,
          text: 'Mantener la piel limpia y seca',
          detail: 'Evita productos químicos agresivos durante 48 horas'
        },
        {
          icon: AlertTriangle,
          text: 'No usar desodorantes con alcohol',
          detail: 'Pueden irritar la piel sensible después del tratamiento'
        },
        {
          icon: Shirt,
          text: 'Evitar prendas ajustadas',
          detail: 'Usa ropa holgada para evitar fricción en la zona tratada'
        }
      ],
      timeline: [
        { day: 1, instruction: 'No frotar la zona tratada' },
        { day: 4, instruction: 'Evitar calor excesivo (sauna, agua muy caliente)' },
        { day: 7, instruction: 'Retomar rutina normal de cuidado' }
      ]
    }
  };

  return (
    <section id="care" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Cuidados importantes
          </h2>
          <p className="text-xl text-gray-600">
            Sigue estas indicaciones para obtener los mejores resultados
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {Object.entries(careInstructions).map(([key, section]) => (
            <div key={key} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => setActiveSection(activeSection === key ? '' : key)}
                className="w-full px-6 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-[#37b7ff]/10 rounded-xl">
                    {React.createElement(section.icon, { 
                      className: "text-[#37b7ff]",
                      size: 24 
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                {activeSection === key ? (
                  <ChevronUp className="text-[#37b7ff]" size={24} />
                ) : (
                  <ChevronDown className="text-gray-400" size={24} />
                )}
              </button>
              
              {activeSection === key && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-6 space-y-4">
                    {section.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-[#37b7ff]/10 rounded-lg">
                          {React.createElement(instruction.icon, { 
                            className: "text-[#37b7ff]",
                            size: 20 
                          })}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {instruction.text}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {instruction.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {section.warning && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-yellow-800 font-medium">
                          {section.warning}
                        </p>
                      </div>
                    )}
                    
                    {section.timeline && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Cronograma de cuidados:
                        </h4>
                        <div className="space-y-3">
                          {section.timeline.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-[#37b7ff] text-white rounded-full flex items-center justify-center font-bold">
                                {item.day}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900">{item.instruction}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Tips */}
        <div className="mt-12 bg-[#37b7ff]/10 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Consejos adicionales
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Para mejores resultados:
              </h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Mantén constancia en las sesiones</li>
                <li>• Hidrata tu piel diariamente</li>
                <li>• Evita otros métodos de depilación</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Señales de alerta:
              </h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Enrojecimiento excesivo</li>
                <li>• Dolor intenso persistente</li>
                <li>• Aparición de ampollas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Care;