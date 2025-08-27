import React from 'react';
import { Info, Crown } from 'lucide-react';

interface Area {
  category: 'grandes' | 'medianas' | 'chicas';
  name: string;
}

interface MembershipSummaryProps {
  areas: Area[];
  membershipType: 'individual' | 'personalizada' | 'combo';
  planName: 'esencial' | 'completa' | 'platinum';
  monthlyPayment: number;
  initialPayment: number;
  totalSessions: number;
}

const MembershipSummary: React.FC<MembershipSummaryProps> = ({
  areas,
  membershipType,
  planName,
  monthlyPayment,
  initialPayment,
  totalSessions
}) => {
  // Definición de categorías y precios para calcular descuentos
  const categories = {
    grandes: {
      plans: {
        esencial: { monthly: 800, sessions: 6 },
        completa: { monthly: 675, sessions: 9 },
        platinum: { monthly: 575, sessions: 12 }
      }
    },
    medianas: {
      plans: {
        esencial: { monthly: 600, sessions: 6 },
        completa: { monthly: 500, sessions: 9 },
        platinum: { monthly: 425, sessions: 12 }
      }
    },
    chicas: {
      plans: {
        esencial: { monthly: 400, sessions: 6 },
        completa: { monthly: 335, sessions: 9 },
        platinum: { monthly: 285, sessions: 12 }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Calcular precio individual para mostrar descuentos
  const calculateIndividualTotal = () => {
    let total = 0;
    areas.forEach(area => {
      const categoryData = categories[area.category];
      const planData = categoryData.plans[planName];
      total += planData.monthly;
    });
    return total;
  };

  const individualTotal = calculateIndividualTotal();
  const savings = individualTotal - monthlyPayment;

  if (areas.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Cálculo</h4>
      
      <div className="space-y-4">
        {/* Tipo de Membresía */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tipo de Membresía:</span>
          <span className="font-semibold capitalize">
            {membershipType === 'combo' ? 'Cuerpo Completo' : membershipType}
          </span>
        </div>

        {/* Número de Áreas */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Número de Áreas:</span>
          <span className="font-semibold">{areas.length}</span>
        </div>

        {/* Plan Seleccionado */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Plan:</span>
          <span className="font-semibold capitalize">{planName}</span>
        </div>

        {/* Total de Sesiones */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total de Sesiones:</span>
          <span className="font-semibold">{totalSessions}</span>
        </div>

        {/* Áreas Seleccionadas */}
        <div className="flex justify-between items-start">
          <span className="text-gray-600">Áreas:</span>
          <div className="flex flex-wrap gap-1 max-w-xs">
            {areas.map((area, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {area.name}
              </span>
            ))}
          </div>
        </div>

        {/* Precios */}
        <div className="border-t pt-4">
          {membershipType === 'personalizada' && savings > 0 && (
            <>
              <div className="flex justify-between items-center text-gray-600">
                <span>Precio Individual:</span>
                <span className="line-through">{formatCurrency(individualTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600 font-semibold">
                <span>Descuento ({areas.length === 2 ? '20%' : areas.length === 3 ? '25%' : '30%'}):</span>
                <span>-{formatCurrency(savings)}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between items-center text-lg font-bold text-[#37b7ff]">
            <span>Pago Mensual:</span>
            <span>{formatCurrency(monthlyPayment)}</span>
          </div>
          
          <div className="flex justify-between items-center text-lg font-bold text-[#37b7ff]">
            <span>Pago Inicial:</span>
            <span>{formatCurrency(initialPayment)}</span>
          </div>
        </div>

        {/* Información Adicional */}
        {membershipType === 'personalizada' && savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <div className="flex items-start space-x-2">
              <Info className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
              <div className="text-sm text-green-800">
                <p className="font-semibold">¡Excelente elección!</p>
                <p>Ahorras {formatCurrency(savings)} mensuales con esta combinación personalizada.</p>
              </div>
            </div>
          </div>
        )}

        {membershipType === 'combo' && (
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
  );
};

export default MembershipSummary;