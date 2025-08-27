import React, { useState, useEffect } from 'react';
import { Lightbulb, Zap, Target, Sparkles } from 'lucide-react';

const WhatIs = () => {
  const [activeStep, setActiveStep] = useState(0);

  const processSteps = [
    {
      id: 0,
      icon: Lightbulb,
      title: 'Emisión de luz',
      description: 'El láser emite luz que es absorbida por el pigmento del vello',
      detail: 'El sistema láser genera pulsos de luz específicos que son atraídos por la melanina del vello.'
    },
    {
      id: 1,
      icon: Zap,
      title: 'Conversión térmica',
      description: 'La melanina convierte la luz en calor controlado',
      detail: 'La energía lumínica se transforma en calor que se concentra en el folículo piloso.'
    },
    {
      id: 2,
      icon: Target,
      title: 'Destrucción folicular',
      description: 'El calor daña el folículo permanentemente',
      detail: 'El calor destruye las células responsables del crecimiento del vello sin dañar la piel.'
    },
    {
      id: 3,
      icon: Sparkles,
      title: 'Piel suave',
      description: 'Retrasa y elimina el crecimiento futuro del vello',
      detail: 'Con sesiones regulares, el vello se debilita hasta desaparecer completamente.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="what-is" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Qué es la depilación láser?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un método avanzado de eliminación de vello que utiliza pulsos de luz láser 
            para destruir los folículos pilosos de forma permanente y segura.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#e3f4ff] to-white rounded-3xl p-8 shadow-xl">
              <div className="relative h-80 flex items-center justify-center">
                {/* Animated Visualization */}
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#37b7ff]/20 to-transparent rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="text-6xl">
                      {React.createElement(processSteps[activeStep].icon, { 
                        className: "text-[#37b7ff] animate-bounce" 
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {processSteps[activeStep].title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {processSteps[activeStep].description}
                </p>
                <p className="text-sm text-gray-500">
                  {processSteps[activeStep].detail}
                </p>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-[#37b7ff]/10 border-2 border-[#37b7ff] shadow-lg' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${
                    activeStep === index ? 'bg-[#37b7ff] text-white' : 'bg-white text-[#37b7ff]'
                  }`}>
                    {React.createElement(step.icon, { size: 24 })}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {step.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {step.detail}
                    </p>
                  </div>
                </div>
                
                {activeStep === index && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#37b7ff] rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIs;