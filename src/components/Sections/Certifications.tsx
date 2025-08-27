import React from 'react';
import { Shield, Award, CheckCircle, Globe } from 'lucide-react';

const Certifications = () => {
  const certifications = [
    {
      id: 'fda',
      name: 'FDA',
      fullName: 'Food and Drug Administration',
      country: 'Estados Unidos',
      description: 'Aprobación de la FDA para uso médico y estético',
      icon: Shield,
      color: 'from-blue-600 to-blue-700',
      badge: 'USA'
    },
    {
      id: 'tuv',
      name: 'TUV Rheinland',
      fullName: 'ISO 13485:2016',
      country: 'Alemania',
      description: 'Certificación de calidad para dispositivos médicos',
      icon: Award,
      color: 'from-red-600 to-red-700',
      badge: 'ISO'
    },
    {
      id: 'ce',
      name: 'CE Médico',
      fullName: 'Conformité Européenne',
      country: 'Unión Europea',
      description: 'Marca CE para dispositivos médicos clase IIa',
      icon: CheckCircle,
      color: 'from-green-600 to-green-700',
      badge: 'EU'
    },
    {
      id: 'tga',
      name: 'TGA',
      fullName: 'Therapeutic Goods Administration',
      country: 'Australia',
      description: 'Aprobación australiana para equipos terapéuticos',
      icon: Globe,
      color: 'from-purple-600 to-purple-700',
      badge: 'AUS'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#37b7ff]/10 text-[#37b7ff] text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Certificaciones Internacionales
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Equipos certificados mundialmente
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestros equipos de depilación láser cuentan con las certificaciones más estrictas 
            a nivel internacional, garantizando seguridad y eficacia comprobada.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group relative bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 text-xs font-bold bg-white text-gray-600 rounded-full shadow-sm">
                  {cert.badge}
                </span>
              </div>

              {/* Icon */}
              <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${cert.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {React.createElement(cert.icon, { size: 32 })}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {cert.name}
                </h3>
                <h4 className="text-sm font-semibold text-[#37b7ff] mb-3">
                  {cert.fullName}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {cert.description}
                </p>
                <p className="text-xs text-gray-500">
                  {cert.country}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#37b7ff] to-[#2da7ef] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl"></div>
            </div>
          ))}
        </div>

        {/* Additional Certifications */}
        <div className="bg-gradient-to-br from-[#37b7ff]/5 to-[#37b7ff]/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Certificaciones adicionales
            </h3>
            <p className="text-gray-600">
              Nuestros equipos también cuentan con aprobaciones de otras autoridades internacionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 bg-white rounded-2xl p-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Globe className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-center">MDSAP Canadá</h4>
                <p className="text-sm text-gray-600 text-center">Programa de Auditoría Única de Dispositivos Médicos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white rounded-2xl p-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="text-green-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-center">RoHS</h4>
                <p className="text-sm text-gray-600 text-center">Restricción de Sustancias Peligrosas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Statement */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#37b7ff]/10 px-6 py-3 rounded-full">
            <CheckCircle className="text-[#37b7ff]" size={20} />
            <span className="font-semibold text-gray-900">
              Tecnología aprobada en más de 50 países
            </span>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            La confianza de autoridades sanitarias mundiales respalda la seguridad 
            y eficacia de nuestros tratamientos de depilación láser.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Certifications;