import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Minus, Info, Sparkles, Crown, Check } from 'lucide-react';

interface Area {
  category: 'grandes' | 'medianas' | 'chicas';
  name: string;
}

interface MembershipCalculatorProps {
  onCalculationChange: (calculation: {
    areas: Area[];
    membershipType: 'individual' | 'personalizada' | 'combo';
    planName: 'esencial' | 'completa' | 'platinum';
    monthlyPayment: number;
    initialPayment: number;
    totalSessions: number;
  }) => void;
  initialAreas?: Area[];
  initialPlan?: 'esencial' | 'completa' | 'platinum';
}

const MembershipCalculator: React.FC<MembershipCalculatorProps> = ({
  onCalculationChange,
  initialAreas = [],
  initialPlan = 'completa'
}) => {
  const [selectedAreas, setSelectedAreas] = useState<Area[]>(initialAreas);
  const [selectedPlan, setSelectedPlan] = useState<'esencial' | 'completa' | 'platinum'>(initialPlan);
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
      return {
        membershipType,
        monthlyPayment: planData.monthly,
        initialPayment: planData.monthly,
        totalSessions: planData.sessions,
        savings: 0,
        individualTotal: 0
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

  // Notificar cambios al componente padre
  useEffect(() => {
    onCalculationChange({
      areas: selectedAreas,
      membershipType: calculation.membershipType,
      planName: selectedPlan,
      monthlyPayment: calculation.monthlyPayment,
      initialPayment: calculation.initialPayment,
      totalSessions: calculation.totalSessions
    });
  }, [selectedAreas, selectedPlan, calculation.monthlyPayment, calculation.initialPayment, calculation.totalSessions, calculation.membershipType]);

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
      case 'completa': return Sparkles;
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

  return (
    <div className="bg-gradient-to-br from-[#37b7ff]/5 to-[#37b7ff]/10 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-[#37b7ff] rounded-lg">
          <Calculator className="text-white" size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Calculadora de Membresías</h3>
      </div>

      {/* Selector de Plan */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Selecciona el Plan</h4>
        <div className="grid grid-cols-3 gap-3">
          {(['esencial', 'completa', 'platinum'] as const).map((plan) => {
            const Icon = getPlanIcon(plan);
            const isSelected = selectedPlan === plan;
            
            return (
              <button
                key={plan}
                type="button"
                onClick={() => {
                  setSelectedPlan(plan);
                  // Scroll automático a la sección de áreas
                  setTimeout(() => {
                    const areasSection = document.getElementById('areas-selection-admin');
                    if (areasSection) {
                      areasSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                      });
                    }
                  }, 100);
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#37b7ff] bg-[#37b7ff]/10 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${getPlanColor(plan)} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="text-white" size={20} />
                </div>
                <div className="text-sm font-semibold capitalize text-gray-900">{plan}</div>
                <div className="text-xs text-gray-600">
                  {plan === 'esencial' && '6 sesiones'}
                  {plan === 'completa' && '9 sesiones ⭐'}
                  {plan === 'platinum' && '12 sesiones'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Áreas Seleccionadas */}
      <div id="areas-selection-admin" className="mb-6 scroll-mt-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-gray-900">Áreas Seleccionadas</h4>
          <button
            type="button"
            onClick={() => {
              setShowAreaSelector(!showAreaSelector);
              if (!showAreaSelector) {
                // Si se está abriendo el selector, hacer scroll suave
                setTimeout(() => {
                  const selectorElement = document.getElementById('area-selector-admin');
                  if (selectorElement) {
                    selectorElement.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }
                }, 100);
              }
            }}
            className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Agregar Área</span>
          </button>
        </div>

        {selectedAreas.length > 0 ? (
          <div id="selected-areas-list-admin" className="space-y-2">
            {selectedAreas.map((area, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${categories[area.category].color}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{area.name}</span>
                  <span className="text-xs px-2 py-1 bg-white/50 rounded-full">
                    {categories[area.category].title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeArea(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calculator className="mx-auto mb-2" size={32} />
            <p>Selecciona áreas para calcular precios</p>
          </div>
        )}
      </div>

      {/* Selector de Áreas */}
      {showAreaSelector && (
        <div id="area-selector-admin" className="mb-6 bg-white rounded-xl p-4 border border-gray-200 scroll-mt-8">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-gray-900">Seleccionar Áreas</h5>
            <button
              type="button"
              onClick={() => setShowAreaSelector(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(categories).map(([categoryKey, category]) => (
              <div key={categoryKey}>
                <h6 className="font-medium text-gray-800 mb-2">{category.title}</h6>
                <div className="grid grid-cols-2 gap-2">
                  {category.zones.map((zone) => {
                    const isSelected = selectedAreas.some(area => area.name === zone);
                    
                    return (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => {
                          if (!isSelected) {
                            addArea(categoryKey as 'grandes' | 'medianas' | 'chicas', zone);
                            // Scroll suave al área agregada después de un breve delay
                            setTimeout(() => {
                              const selectedAreasElement = document.getElementById('selected-areas-list-admin');
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
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {isSelected && <Check size={14} className="inline mr-1" />}
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
        <div id="calculation-summary-admin" className="bg-white rounded-xl p-6 border border-gray-200 scroll-mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Cálculo</h4>
          
          <div className="space-y-4">
            {/* Tipo de Membresía */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tipo de Membresía:</span>
              <span className="font-semibold capitalize">
                {calculation.membershipType === 'combo' ? 'Cuerpo Completo' : calculation.membershipType}
              </span>
            </div>

            {/* Número de Áreas */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Número de Áreas:</span>
              <span className="font-semibold">{selectedAreas.length}</span>
            </div>

            {/* Plan Seleccionado */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold capitalize">{selectedPlan}</span>
            </div>

            {/* Total de Sesiones */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Sesiones:</span>
              <span className="font-semibold">{calculation.totalSessions}</span>
            </div>

            {/* Precios */}
            <div className="border-t pt-4">
              {calculation.membershipType === 'personalizada' && calculation.savings > 0 && (
                <>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Precio Individual:</span>
                    <span className="line-through">{formatCurrency(calculation.individualTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600 font-semibold">
                    <span>Descuento ({selectedAreas.length === 2 ? '20%' : selectedAreas.length === 3 ? '25%' : '30%'}):</span>
                    <span>-{formatCurrency(calculation.savings)}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between items-center text-lg font-bold text-[#37b7ff]">
                <span>Pago Mensual:</span>
                <span>{formatCurrency(calculation.monthlyPayment)}</span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold text-[#37b7ff]">
                <span>Pago Inicial:</span>
                <span>{formatCurrency(calculation.initialPayment)}</span>
              </div>
            </div>

            {/* Información Adicional */}
            {calculation.membershipType === 'personalizada' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <div className="flex items-start space-x-2">
                  <Info className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold">¡Excelente elección!</p>
                    <p>Ahorras {formatCurrency(calculation.savings)} mensuales con esta combinación personalizada.</p>
                  </div>
                </div>
              </div>
            )}

            {calculation.membershipType === 'combo' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
                <div className="flex items-start space-x-2">
                  <Crown className="text-purple-600 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm text-purple-800">
                    <p className="font-semibold">¡Cuerpo Completo!</p>
                    <p>Tratamiento integral con precio especial para 5 o más áreas.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipCalculator;