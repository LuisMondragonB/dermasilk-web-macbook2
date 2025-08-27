import React, { useState } from 'react';
import { Calculator, Plus, Minus, MessageCircle, Sparkles, Crown, Check, Star } from 'lucide-react';

interface Area {
  category: 'grandes' | 'medianas' | 'chicas';
  name: string;
}

const MembershipCalculator = () => {
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<'esencial' | 'completa' | 'platinum'>('completa');
  const [showAreaSelector, setShowAreaSelector] = useState(false);

  // Definición de categorías y precios según MEMBRESIAS.md
  const categories = {
    grandes: {
      title: 'Áreas Grandes',
      zones: ['Piernas Completas', 'Brazos', 'Espalda'],
      plans: {
        esencial: { monthly: 800, sessions: 6 },
        completa: { monthly: 675, sessions: 9 },
        platinum: { monthly: 575, sessions: 12 }
      },
      color: 'bg-red-50 border-red-200 text-red-800'
    },
    medianas: {
      title: 'Áreas Medianas',
      zones: ['Abdomen', '1/2 Piernas', '1/2 Brazos', 'Rostro', 'Bikini', 'Glúteos', 'Pecho', 'Hombros', '1/2 Espalda', 'Axilas'],
      plans: {
        esencial: { monthly: 600, sessions: 6 },
        completa: { monthly: 500, sessions: 9 },
        platinum: { monthly: 425, sessions: 12 }
      },
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    chicas: {
      title: 'Áreas Chicas',
      zones: ['Manos', 'Pies', 'Intergluteo', 'Bigote', 'Pómulos', 'Mentón', 'Areolas', 'Patillas', 'Cuello', 'Nuca'],
      plans: {
        esencial: { monthly: 400, sessions: 6 },
        completa: { monthly: 335, sessions: 9 },
        platinum: { monthly: 285, sessions: 12 }
      },
      color: 'bg-green-50 border-green-200 text-green-800'
    }
  };

  // Precios para Cuerpo Completo
  const cuerpoCompletoPlans = {
    esencial: { monthly: 2299, sessions: 6 },
    completa: { monthly: 1899, sessions: 9 },
    platinum: { monthly: 1799, sessions: 12 }
  };

  const calculatePricing = () => {
    if (selectedAreas.length === 0) {
      return {
        membershipType: 'individual' as const,
        monthlyPayment: 0,
        initialPayment: 0,
        totalSessions: 0,
        savings: 0,
        individualTotal: 0
      };
    }

    // Determinar tipo de membresía
    let membershipType: 'individual' | 'personalizada' | 'combo';
    if (selectedAreas.length === 1) {
      membershipType = 'individual';
    } else if (selectedAreas.length >= 5) {
      membershipType = 'combo';
    } else {
      membershipType = 'personalizada';
    }

    // Calcular para Cuerpo Completo (5+ áreas)
    if (membershipType === 'combo') {
      const planData = cuerpoCompletoPlans[selectedPlan];
      
      // Calcular precio individual total para mostrar el descuento
      let individualTotal = 0;
      selectedAreas.forEach(area => {
        const categoryData = categories[area.category];
        const planData = categoryData.plans[selectedPlan];
        individualTotal += planData.monthly;
      });
      
      const savings = individualTotal - planData.monthly;
      
      return {
        membershipType,
        monthlyPayment: planData.monthly,
        initialPayment: planData.monthly,
        totalSessions: planData.sessions,
        savings: savings > 0 ? savings : 0,
        individualTotal
      };
    }

    // Calcular precio individual total
    let individualTotal = 0;
    let maxSessions = 0;

    selectedAreas.forEach(area => {
      const categoryData = categories[area.category];
      const planData = categoryData.plans[selectedPlan];
      individualTotal += planData.monthly;
      maxSessions = Math.max(maxSessions, planData.sessions);
    });

    // Para membresía individual (1 área)
    if (membershipType === 'individual') {
      return {
        membershipType,
        monthlyPayment: individualTotal,
        initialPayment: individualTotal,
        totalSessions: maxSessions,
        savings: 0,
        individualTotal
      };
    }

    // Para membresía personalizada (2-4 áreas) - aplicar descuentos
    let discount = 0;
    if (selectedAreas.length === 2) discount = 0.20;
    else if (selectedAreas.length === 3) discount = 0.25;
    else if (selectedAreas.length === 4) discount = 0.30;

    const discountedPrice = Math.round(individualTotal * (1 - discount));
    const savings = individualTotal - discountedPrice;

    return {
      membershipType,
      monthlyPayment: discountedPrice,
      initialPayment: discountedPrice,
      totalSessions: maxSessions,
      savings,
      individualTotal
    };
  };

  const calculation = calculatePricing();

  const addArea = (category: 'grandes' | 'medianas' | 'chicas', zoneName: string) => {
    const newArea: Area = { category, name: zoneName };
    setSelectedAreas(prev => [...prev, newArea]);
  };

  const removeArea = (index: number) => {
    setSelectedAreas(prev => prev.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'esencial': return Check;
      case 'completa': return Star;
      case 'platinum': return Crown;
      default: return Check;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'esencial': return 'from-blue-500 to-blue-600';
      case 'completa': return 'from-purple-500 to-purple-600';
      case 'platinum': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const handleWhatsAppClick = () => {
    let message = '¡Hola! Calculé mi membresía personalizada y me interesa:\n\n';
    
    if (selectedAreas.length > 0) {
      message += `📍 Áreas seleccionadas:\n`;
      selectedAreas.forEach(area => {
        message += `• ${area.name}\n`;
      });
      
      message += `\n💎 Plan: ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}\n`;
      message += `💰 Pago mensual: ${formatCurrency(calculation.monthlyPayment)}\n`;
      message += `🎯 Total de sesiones: ${calculation.totalSessions}\n`;
      
      if (calculation.savings > 0) {
        message += `💚 Ahorro mensual: ${formatCurrency(calculation.savings)}\n`;
      }
      
      message += `\n¿Podrían darme más información y disponibilidad para agendar?`;
    } else {
      message += 'Me interesa conocer más sobre las membresías. ¿Podrían darme información y disponibilidad?';
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/524433110777?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-[#37b7ff]/5 to-[#37b7ff]/10 rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-[#37b7ff] rounded-xl">
            <Calculator className="text-white" size={32} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">Calculadora de Membresías</h3>
        </div>
        <p className="text-xl text-gray-600">
          Personaliza tu plan y descubre cuánto puedes ahorrar
        </p>
      </div>

      {/* Selector de Plan */}
      <div className="mb-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">1. Selecciona tu Plan</h4>
        <div className="grid md:grid-cols-3 gap-6">
          {(['esencial', 'completa', 'platinum'] as const).map((plan) => {
            const Icon = getPlanIcon(plan);
            const isSelected = selectedPlan === plan;
            const isPopular = plan === 'completa';
            
            return (
              <div
                key={plan}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected ? 'transform scale-110' : 'hover:transform hover:scale-105'
                }`}
                onClick={() => {
                  setSelectedPlan(plan);
                  // Scroll automático a la sección de áreas
                  setTimeout(() => {
                    const areasSection = document.getElementById('areas-selection');
                    if (areasSection) {
                      areasSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                      });
                    }
                  }, 100);
                }}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-[#37b7ff] text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Star size={14} />
                      <span>MÁS POPULAR</span>
                    </span>
                  </div>
                )}
                
                <div className={`p-6 rounded-2xl border-3 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#37b7ff] bg-gradient-to-br from-[#37b7ff]/10 to-[#37b7ff]/20 shadow-2xl ring-4 ring-[#37b7ff]/30'
                    : 'border-gray-200 hover:border-[#37b7ff]/50 bg-white shadow-lg hover:shadow-xl'
                }`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${getPlanColor(plan)} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold capitalize mb-2 ${
                      isSelected ? 'text-[#37b7ff]' : 'text-gray-900'
                    }`}>{plan}</div>
                    <div className="text-lg text-gray-600 mb-3">
                      {plan === 'esencial' && '6 sesiones'}
                      {plan === 'completa' && '9 sesiones ⭐'}
                      {plan === 'platinum' && '12 sesiones'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {plan === 'esencial' && 'Resultados básicos'}
                      {plan === 'completa' && 'Resultados superiores'}
                      {plan === 'platinum' && 'Resultados perfectos'}
                    </div>
                  </div>
                  
                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-[#37b7ff] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Áreas Seleccionadas */}
      <div id="areas-selection" className="mb-8 scroll-mt-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-bold text-gray-900">2. Selecciona tus Áreas</h4>
          <button
            onClick={() => {
              setShowAreaSelector(!showAreaSelector);
              if (!showAreaSelector) {
                // Si se está abriendo el selector, hacer scroll suave
                setTimeout(() => {
                  const selectorElement = document.getElementById('area-selector');
                  if (selectorElement) {
                    selectorElement.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }
                }, 100);
              }
            }}
            className="bg-[#37b7ff] text-white px-6 py-3 rounded-full hover:bg-[#2da7ef] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Agregar Área</span>
          </button>
        </div>

        {selectedAreas.length > 0 ? (
          <div id="selected-areas-list" className="grid md:grid-cols-2 gap-4 mb-6">
            {selectedAreas.map((area, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${categories[area.category].color} shadow-sm`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-lg">{area.name}</span>
                  <span className="text-sm px-3 py-1 bg-white/70 rounded-full font-medium">
                    {categories[area.category].title}
                  </span>
                </div>
                <button
                  onClick={() => removeArea(index)}
                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Minus size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <Calculator className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-xl text-gray-500 mb-2">Selecciona áreas para calcular precios</p>
            <p className="text-gray-400">Haz clic en "Agregar Área" para comenzar</p>
          </div>
        )}
      </div>

      {/* Selector de Áreas */}
      {showAreaSelector && (
        <div id="area-selector" className="mb-8 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg scroll-mt-8">
          <div className="flex items-center justify-between mb-6">
            <h5 className="text-xl font-bold text-gray-900">Seleccionar Áreas de Tratamiento</h5>
            <button
              onClick={() => setShowAreaSelector(false)}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Minus size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            {Object.entries(categories).map(([categoryKey, category]) => (
              <div key={categoryKey}>
                <h6 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className={`w-4 h-4 rounded-full mr-3 ${
                    categoryKey === 'grandes' ? 'bg-red-500' :
                    categoryKey === 'medianas' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></span>
                  {category.title}
                </h6>
                <div className="grid md:grid-cols-3 gap-3">
                  {category.zones.map((zone) => {
                    const isSelected = selectedAreas.some(area => area.name === zone);
                    
                    return (
                      <button
                        key={zone}
                        onClick={() => {
                          if (!isSelected) {
                            addArea(categoryKey as 'grandes' | 'medianas' | 'chicas', zone);
                            // Scroll suave al área agregada después de un breve delay
                            setTimeout(() => {
                              const selectedAreasElement = document.getElementById('selected-areas-list');
                              if (selectedAreasElement) {
                                selectedAreasElement.scrollIntoView({ 
                                  behavior: 'smooth', 
                                  block: 'nearest' 
                                });
                              }
                            }, 200);
                          }
                        }}
                        disabled={isSelected}
                        className={`px-4 py-3 text-sm rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#37b7ff] hover:text-[#37b7ff] cursor-pointer'
                        }`}
                      >
                        {isSelected && <Check size={16} className="inline mr-2" />}
                        {zone}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de Cálculo */}
      {selectedAreas.length > 0 && (
        <div id="calculation-summary" className="bg-white rounded-2xl p-8 border-2 border-[#37b7ff]/20 shadow-xl scroll-mt-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">3. Tu Membresía Personalizada</h4>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Detalles */}
            <div className="space-y-4 order-2 md:order-1">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Tipo de Membresía:</span>
                <span className="font-bold text-lg capitalize">
                  {calculation.membershipType === 'combo' ? 'Cuerpo Completo' : calculation.membershipType}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Número de Áreas:</span>
                <span className="font-bold text-lg">{selectedAreas.length}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Plan Seleccionado:</span>
                <span className="font-bold text-lg capitalize">{selectedPlan}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Total de Sesiones:</span>
                <span className="font-bold text-lg">{calculation.totalSessions}</span>
              </div>
            </div>

            {/* Precios */}
            <div className="bg-gradient-to-br from-[#37b7ff]/10 to-[#37b7ff]/20 rounded-xl p-6 order-1 md:order-2">
              {(calculation.membershipType === 'personalizada' || calculation.membershipType === 'combo') && calculation.savings > 0 && (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-600 mb-2 space-y-1 sm:space-y-0">
                    <span>Precio Individual:</span>
                    <span className="line-through text-lg font-semibold">{formatCurrency(calculation.individualTotal)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-green-600 font-bold mb-4 space-y-1 sm:space-y-0">
                    <span>Descuento ({
                      calculation.membershipType === 'combo' 
                        ? Math.round((calculation.savings / calculation.individualTotal) * 100) + '%'
                        : selectedAreas.length === 2 ? '20%' : selectedAreas.length === 3 ? '25%' : '30%'
                    }):</span>
                    <span className="text-xl font-bold">-{formatCurrency(calculation.savings)}</span>
                  </div>
                </>
              )}
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[#37b7ff] mb-3 space-y-2 sm:space-y-0">
                <span>Pago Mensual:</span>
                <span className="text-3xl sm:text-2xl font-bold">{formatCurrency(calculation.monthlyPayment)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[#37b7ff] space-y-2 sm:space-y-0">
                <span>Pago Inicial:</span>
                <span className="text-2xl sm:text-xl font-bold">{formatCurrency(calculation.initialPayment)}</span>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          {(calculation.membershipType === 'personalizada' || calculation.membershipType === 'combo') && calculation.savings > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mt-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <div className="text-green-800">
                  <p className="font-bold text-lg">
                    {calculation.membershipType === 'combo' ? '¡SÚPER DESCUENTO CUERPO COMPLETO!' : '¡Excelente elección!'}
                  </p>
                  <p className="text-lg">
                    Ahorras <span className="font-bold text-2xl text-green-700">{formatCurrency(calculation.savings)}</span> mensuales 
                    {calculation.membershipType === 'combo' ? ' con el paquete Cuerpo Completo' : ' con esta combinación personalizada'}.
                  </p>
                  {calculation.membershipType === 'combo' && (
                    <div className="mt-3 space-y-2">
                      <p className="text-base font-semibold">
                        ¡Eso es un ahorro de <span className="text-green-700">{formatCurrency(calculation.savings * 12)}</span> al año!
                      </p>
                      <div className="bg-white/70 rounded-lg p-3 border border-green-300">
                        <p className="font-bold text-green-900 mb-1">💡 ¡APROVECHA AL MÁXIMO!</p>
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Mismo precio para 5, 10 o 15 áreas.</span> 
                          ¿Por qué no agregar todas las que necesites? 
                          <span className="font-bold">¡Es el mismo costo mensual!</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {calculation.membershipType === 'combo' && calculation.savings === 0 && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mt-6">
              <div className="flex items-start space-x-3">
                <Crown className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                <div className="text-purple-800">
                  <p className="font-bold text-lg">¡Cuerpo Completo Premium!</p>
                  <div className="space-y-2">
                    <p className="text-lg">Tratamiento integral con precio especial para 5 o más áreas.</p>
                    <div className="bg-white/50 rounded-lg p-3 border border-purple-300">
                      <p className="font-bold text-purple-900 mb-1">💡 ¡APROVECHA AL MÁXIMO!</p>
                      <p className="text-sm text-purple-800">
                        <span className="font-semibold">Mismo precio para 5, 10 o 15 áreas.</span> 
                        ¿Por qué no agregar todas las que necesites? 
                        <span className="font-bold">¡Es el mismo costo mensual!</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Incentivo para agregar más áreas cuando tiene 5+ */}
          {calculation.membershipType === 'combo' && selectedAreas.length >= 5 && selectedAreas.length < 10 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 mt-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🔥</div>
                <div className="text-yellow-900">
                  <p className="font-bold text-lg">¡Oportunidad Única!</p>
                  <p className="text-base mb-2">
                    Tienes {selectedAreas.length} áreas seleccionadas. 
                    <span className="font-bold text-yellow-800"> ¿Por qué no agregar más?</span>
                  </p>
                  <div className="bg-white/70 rounded-lg p-3 border border-yellow-400">
                    <p className="text-sm font-semibold text-yellow-900">
                      ✨ Piernas, Brazos, Axilas, Bikini, Rostro, Espalda... 
                      <span className="font-bold">¡Todas al mismo precio!</span>
                    </p>
                    <p className="text-xs text-yellow-800 mt-1">
                      Aprovecha que ya tienes el descuento máximo de Cuerpo Completo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* CTA Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleWhatsAppClick}
              className="bg-[#37b7ff] text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-[#2da7ef] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
            >
              <MessageCircle size={24} />
              <span>Solicitar Esta Membresía</span>
            </button>
            <p className="text-gray-600 mt-4">
              Te contactaremos para agendar tu consulta gratuita + primera sesión de axilas GRATIS
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipCalculator;