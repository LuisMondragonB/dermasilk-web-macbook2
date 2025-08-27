import React from 'react';
import { Infinity, Sparkles, Heart, Star } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Infinity,
      title: 'Resultados Duraderos',
      description: 'Reduce permanentemente el crecimiento del vello, ahorrándote tiempo y dinero a largo plazo.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Sparkles,
      title: 'Aclara la piel',
      description: 'Mejora la apariencia de axilas e ingles, eliminando manchas y oscurecimientos.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Menos Dolor',
      description: 'Mucho más cómodo que la cera o el afeitado tradicional, con mínimas molestias.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Star,
      title: 'Piel Tersa',
      description: 'Fomenta la producción de colágeno, dejando tu piel más suave y rejuvenecida.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Beneficios únicos de nuestro tratamiento
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre por qué más de 1,000 clientes han elegido Dermasilk® para transformar su piel
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${benefit.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {React.createElement(benefit.icon, { size: 32 })}
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#37b7ff] to-[#2da7ef] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl"></div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#37b7ff] mb-2">95%</div>
            <p className="text-gray-600">Reducción del vello</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#37b7ff] mb-2">6, 9 o 12</div>
            <p className="text-gray-600">Sesiones</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#37b7ff] mb-2">100%</div>
            <p className="text-gray-600">Satisfacción garantizada</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;