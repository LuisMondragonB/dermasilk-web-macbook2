import React, { useState, useEffect } from 'react';
import { MessageCircle, Shield, Star, Check, Calculator, Users, Award, Zap, Heart, Crown, Sparkles, Phone, Mail } from 'lucide-react';
import MembershipCalculator from '../components/MembershipCalculator';

const MembershipsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('medianas');
  const [selectedPlan, setSelectedPlan] = useState('completa');
  const [showCalculator, setShowCalculator] = useState(false);

  // Asegurar que la página inicie desde el top solo si no hay navegación con hash
  useEffect(() => {
    // Solo hacer scroll al top si no hay un elemento hero específico siendo buscado
    const timer = setTimeout(() => {
      if (!window.location.hash && !document.querySelector('#hero:target')) {
        window.scrollTo(0, 0);
      }
    }, 50); // Reducir el timeout para evitar interferencias
    
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/524433110777?text=${encodedMessage}`, '_blank');
  };

  const categories = {
    grandes: {
      title: 'Áreas Grandes',
      description: 'Piernas Completas, Brazos, Espalda',
      plans: {
        esencial: { monthly: 800, sessions: 6 },
        completa: { monthly: 675, sessions: 9 },
        platinum: { monthly: 575, sessions: 12 }
      }
    },
    medianas: {
      title: 'Áreas Medianas',
      description: 'Abdomen, 1/2 Piernas, 1/2 Brazos, Rostro, Bikini, Glúteos, Pecho, Hombros, 1/2 Espalda, Axilas',
      plans: {
        esencial: { monthly: 600, sessions: 6 },
        completa: { monthly: 500, sessions: 9 },
        platinum: { monthly: 425, sessions: 12 }
      }
    },
    chicas: {
      title: 'Áreas Chicas',
      description: 'Manos, Pies, Líneas, Bigote, Pómulos, Mentón, Areolas, Patillas, Cuello, Nuca',
      plans: {
        esencial: { monthly: 400, sessions: 6 },
        completa: { monthly: 335, sessions: 9 },
        platinum: { monthly: 285, sessions: 12 }
      }
    }
  };

  const combos = [
    {
      name: 'COMBO AXILAS + BIKINI',
      description: 'Las 2 Zonas Más Solicitadas',
      example: 'Axilas + Bikini',
      monthly: 800,
      duration: 9,
      savings: 200,
      popular: false
    },
    {
      name: 'COMBO PIERNAS + AXILAS',
      description: 'La Combinación Más Popular',
      example: 'Piernas + Axilas',
      monthly: 940,
      duration: 9,
      savings: 235,
      popular: true
    },
    {
      name: 'COMBO TRIPLE',
      description: 'Piernas + Axilas + Bikini',
      example: 'Las 3 áreas más demandadas',
      monthly: 1069,
      duration: 12,
      savings: 356,
      popular: false
    }
  ];

  const planFeatures = {
    esencial: {
      icon: Check,
      color: 'blue',
      features: [
        'Sesiones programadas',
        'Seguimiento personalizado',
        'Tecnología FDA certificada'
      ]
    },
    completa: {
      icon: Star,
      color: 'purple',
      features: [
        'Todo lo de Esencial',
        '3 sesiones extra',
        'Kit premium incluido',
        'WhatsApp VIP',
        'Tratamiento hidratante post-sesión',
        'Acceso prioritario a citas'
      ]
    },
    platinum: {
      icon: Crown,
      color: 'yellow',
      features: [
        'Todo lo de Completa',
        '6 sesiones extra (vs Esencial)',
        'Análisis personalizado de piel y vello',
        'Productos de lujo incluidos',
        'Horarios VIP exclusivos',
        'Sesión de relajación incluida'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen bg-gradient-to-br from-[#e3f4ff] via-white to-[#f5f5f7] overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#37b7ff]/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#37b7ff]/10 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-300/10 rounded-full blur-lg animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-36 h-36 bg-gray-300/10 rounded-full blur-lg animate-float-delayed"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#37b7ff]/10 text-[#37b7ff] text-sm font-medium mb-8 animate-pulse">
              <span className="w-2 h-2 bg-[#37b7ff] rounded-full mr-2"></span>
              Membresías con pagos mensuales
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Revolución en Depilación Láser:
              <br />
              <span className="text-[#37b7ff]">Sistema de Membresías</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              La primera clínica en Morelia que hace accesible la tecnología FDA más avanzada 
              con planes de pago mensuales diseñados para tu comodidad.
            </p>
            
            <p className="text-lg mb-12 max-w-3xl mx-auto text-gray-600">
              Hasta 40% de reducción desde la primera sesión con tecnología Diodo TríoFDA aprobada. 
              Ahora puedes acceder a resultados profesionales sin comprometer tu presupuesto mensual.
            </p>
            
            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <button
                onClick={() => handleWhatsAppClick('¡Hola! Quiero agendar mi consulta gratuita + primera sesión de axilas GRATIS. ¿Cuándo tienen disponibilidad?')}
                className="bg-[#37b7ff] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2da7ef] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
              >
                <MessageCircle size={20} />
                <span>Consulta Gratuita + Axilas GRATIS</span>
              </button>
              <div className="text-center">
                <div className="text-sm text-gray-500">Valor</div>
                <div className="text-2xl font-bold line-through text-gray-400">$1,300</div>
                <div className="text-lg font-bold text-green-600">¡GRATIS HOY!</div>
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

      {/* What are Memberships */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Qué son las Membresías Dermasilk®?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Nuestro sistema de membresías te permite acceder a la depilación láser más efectiva de Morelia 
              con pagos mensuales cómodos, en lugar de una inversión grande por adelantado. 
              Es como tener un plan de telefonía, pero para tu belleza y confianza.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sin pagos enormes por adelantado</h3>
              <p className="text-gray-600">Solo mensualidad cómoda</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Más sesiones = Mejores resultados</h3>
              <p className="text-gray-600">Hasta 12 sesiones vs 6 tradicionales</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tecnología FDA certificada</h3>
              <p className="text-gray-600">La misma calidad premium de siempre</p>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Perfect Plan */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Elige tu plan perfecto
            </h2>
            <p className="text-xl text-gray-600">
              Selecciona la categoría de área que te interesa
            </p>
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === key
                    ? 'bg-[#37b7ff] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Selected Category Info */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {categories[selectedCategory as keyof typeof categories].title}
            </h3>
            <p className="text-gray-600">
              {categories[selectedCategory as keyof typeof categories].description}
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(categories[selectedCategory as keyof typeof categories].plans).map(([planKey, plan]) => {
              const features = planFeatures[planKey as keyof typeof planFeatures];
              const isPopular = planKey === 'completa';
              
              return (
                <div
                  key={planKey}
                  className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isPopular ? 'ring-2 ring-[#37b7ff] transform scale-105' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#37b7ff] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                        <Star size={16} />
                        <span>MÁS POPULAR</span>
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${features.color}-500 to-${features.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {React.createElement(features.icon, { className: "text-white", size: 32 })}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 capitalize mb-2">{planKey}</h3>
                    <div className="text-3xl font-bold text-[#37b7ff] mb-1">${plan.monthly}/mes</div>
                    <div className="text-sm text-gray-500 mt-2">{plan.sessions} sesiones</div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {features.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="text-green-500 flex-shrink-0" size={16} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleWhatsAppClick(`¡Hola! Me interesa el plan ${planKey} para ${categories[selectedCategory as keyof typeof categories].title}. ¿Podrían darme más información?`)}
                    className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
                      isPopular
                        ? 'bg-[#37b7ff] text-white hover:bg-[#2da7ef]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Elegir Plan
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Combos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Paquetes Combinados Populares
            </h2>
            <p className="text-xl text-gray-600">
              Combina áreas y ahorra más dinero cada mes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {combos.map((combo, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  combo.popular ? 'ring-2 ring-[#37b7ff] transform scale-105' : ''
                }`}
              >
                {combo.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#37b7ff] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Crown size={16} />
                      <span>MÁS POPULAR</span>
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{combo.name}</h3>
                  <p className="text-gray-600 mb-2">{combo.description}</p>
                  <p className="text-sm text-[#37b7ff] font-semibold">{combo.example}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[#37b7ff] mb-2">${combo.monthly}/mes</div>
                  <div className="text-gray-600 mb-2">x {combo.duration} meses</div>
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ¡Ahorra ${combo.savings}/mes!
                  </div>
                </div>

                <button
                  onClick={() => handleWhatsAppClick(`¡Hola! Me interesa el ${combo.name} (${combo.example}). ¿Podrían darme más información sobre este paquete?`)}
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
                    combo.popular
                      ? 'bg-[#37b7ff] text-white hover:bg-[#2da7ef]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Más Información
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Memberships */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Calculadora Personalizada
            </h2>
            <p className="text-xl text-gray-600">
              Crea tu membresía ideal y descubre cuánto puedes ahorrar
            </p>
          </div>

          <MembershipCalculator />
        </div>
      </section>

      {/* Custom Memberships Info */}
      <section className="py-20 bg-gradient-to-br from-[#37b7ff] to-[#2da7ef] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              ¿Necesitas más zonas?
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">
              Personaliza tu membresía
            </h3>
            <p className="text-xl max-w-4xl mx-auto">
              Nuestros paquetes combinados cubren las combinaciones más populares, 
              pero entendemos que cada mujer es única. ¡Personaliza tu membresía exactamente como la necesitas!
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">2 zonas</div>
              <div className="text-xl mb-2">20% descuento</div>
              <p className="text-white/80">sobre precios individuales</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">3 zonas</div>
              <div className="text-xl mb-2">25% descuento</div>
              <p className="text-white/80">sobre precios individuales</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">4 zonas</div>
              <div className="text-xl mb-2">30% descuento</div>
              <p className="text-white/80">sobre precios individuales</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">Cuerpo Completo</div>
              <div className="text-xl mb-2">$1,899/mes</div>
              <p className="text-white/80">tratamiento integral</p>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h4 className="text-2xl font-bold mb-4">"La Ejecutiva" (4 zonas)</h4>
              <p className="mb-4">Piernas + Axilas + Bigote + Patillas</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Individual:</span>
                  <span className="line-through">$1,510/mes</span>
                </div>
                <div className="flex justify-between font-bold text-xl">
                  <span>Personalizada:</span>
                  <span>$1,057/mes</span>
                </div>
                <div className="text-green-300 font-semibold">
                  ¡Ahorras $453 mensuales!
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => handleWhatsAppClick('¡Hola! Quiero crear una membresía personalizada. ¿Podrían ayudarme a calcular el mejor plan para mis necesidades?')}
              className="bg-white text-[#37b7ff] px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
            >
              <Calculator size={24} />
              <span>Crear Mi Membresía Personalizada</span>
            </button>
          </div>
        </div>
      </section>

      {/* Rewards System */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Sistema de Recompensas
            </h2>
            <p className="text-xl text-gray-600">
              Gana puntos automáticamente y conviértelos en beneficios exclusivos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Gana Puntos Automáticamente</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Referir amigas: +100 puntos</div>
                    <div className="text-sm text-gray-600">cuando firmen membresía</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Reseñas 5 estrellas: +100 puntos</div>
                    <div className="text-sm text-gray-600">en Google o Facebook</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Sparkles className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Fotos antes/después: +50 puntos</div>
                    <div className="text-sm text-gray-600">con tu autorización</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Completar membresía: +200 puntos</div>
                    <div className="text-sm text-gray-600">bonus al finalizar</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Convierte Puntos en Beneficios</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">20% descuento en nueva zona</span>
                    <span className="bg-[#37b7ff] text-white px-3 py-1 rounded-full text-sm">200 pts</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Sesión de retoque GRATIS</span>
                    <span className="bg-[#37b7ff] text-white px-3 py-1 rounded-full text-sm">300 pts</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Kit de productos exclusivos</span>
                    <span className="bg-[#37b7ff] text-white px-3 py-1 rounded-full text-sm">150 pts</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Status VIP permanente</span>
                    <span className="bg-[#37b7ff] text-white px-3 py-1 rounded-full text-sm">500 pts</span>
                  </div>
                  <div className="text-sm text-gray-600">beneficios de por vida</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why More Sessions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Por qué más sesiones?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              La ciencia lo comprueba: más sesiones = mejores resultados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center bg-blue-50 rounded-2xl p-8">
              <div className="text-4xl font-bold text-blue-600 mb-4">6 sesiones</div>
              <div className="text-2xl font-semibold text-gray-900 mb-2">60-70%</div>
              <p className="text-gray-600">de reducción (estándar industria)</p>
            </div>

            <div className="text-center bg-purple-50 rounded-2xl p-8 ring-2 ring-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-4">9 sesiones</div>
              <div className="text-2xl font-semibold text-gray-900 mb-2">80-85%</div>
              <p className="text-gray-600">de reducción (resultados superiores)</p>
            </div>

            <div className="text-center bg-yellow-50 rounded-2xl p-8">
              <div className="text-4xl font-bold text-yellow-600 mb-4">12 sesiones</div>
              <div className="text-2xl font-semibold text-gray-900 mb-2">90-95%</div>
              <p className="text-gray-600">de reducción (perfección casi absoluta)</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#37b7ff]/10 to-[#37b7ff]/20 rounded-3xl p-8 text-center">
            <p className="text-lg text-gray-700">
              <strong>Estudios FDA</strong> demuestran que las sesiones adicionales no solo mejoran el porcentaje de reducción, 
              sino que hacen los resultados mucho más duraderos en el tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Comparisons */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Comparativas Simples
            </h2>
            <p className="text-xl text-gray-600">
              Menos de lo que gastas en otros cuidados de belleza
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="text-2xl font-bold text-[#37b7ff] mb-4">Piernas Completas Platinum</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$575/mes</div>
              <p className="text-gray-600">Menos que una cena semanal en restaurante</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="text-2xl font-bold text-[#37b7ff] mb-4">Axilas Completa</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$500/mes</div>
              <p className="text-gray-600">Menos que un corte y tinte mensual</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
              <div className="text-2xl font-bold text-[#37b7ff] mb-4">Bigote Platinum</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$285/mes</div>
              <p className="text-gray-600">Menos que una manicura semanal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Start Today */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Inicia hoy mismo
          </h2>
          <p className="text-xl mb-12">
            Tres pasos simples para comenzar tu transformación
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="w-16 h-16 bg-[#37b7ff] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Agenda tu consulta</h3>
              <p className="text-white/80">Consulta gratuita + sesión de axilas sin costo</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="w-16 h-16 bg-[#37b7ff] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Elige tu plan</h3>
              <p className="text-white/80">El que mejor se adapte a tu presupuesto y objetivos</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="w-16 h-16 bg-[#37b7ff] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Comienza tu transformación</h3>
              <p className="text-white/80">Con el primer pago cómodo</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => handleWhatsAppClick('¡Hola! Quiero agendar mi consulta gratuita + primera sesión de axilas GRATIS para conocer las membresías. ¿Cuándo tienen disponibilidad?')}
              className="bg-[#37b7ff] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2da7ef] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
            >
              <MessageCircle size={20} />
              <span>Agendar Consulta Gratuita</span>
            </button>
            
            <button
              onClick={() => handleWhatsAppClick('¡Hola! Quiero calcular mi plan personalizado de membresía. ¿Podrían ayudarme?')}
              className="bg-white/10 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-3 border border-white/20"
            >
              <Calculator size={20} />
              <span>Calcular Mi Plan</span>
            </button>
          </div>

          <div className="mt-12 border-t border-white/20 pt-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-white">Dermasilk®</span>
            </div>
            <p className="text-gray-400 text-sm">
              "Un toque de luz para una piel perfecta"
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Plaza GEA, Morelia, Michoacán • WhatsApp: 443 311 0777
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};


export default MembershipsPage;

