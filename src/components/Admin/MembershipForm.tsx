import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calculator, User, Phone, Mail, Calendar, CreditCard, FileText, Minus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MembershipCalculator from './MembershipCalculator';
import MembershipSummary from './MembershipSummary';
import CustomModal from './CustomModal';

interface MembershipFormProps {
  membership?: Membership | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface Area {
  category: 'grandes' | 'medianas' | 'chicas';
  name: string;
}

interface Membership {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  membership_type: 'individual' | 'combo' | 'personalizada';
  plan_name: 'esencial' | 'completa' | 'platinum';
  areas: Area[];
  monthly_payment: number;
  initial_payment: number;
  total_sessions: number;
  completed_sessions: number;
  start_date: string;
  end_date: string | null;
  status: 'activa' | 'pausada' | 'completada' | 'cancelada';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const MembershipForm: React.FC<MembershipFormProps> = ({ membership, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [localMembership, setLocalMembership] = useState(membership);
  const [errors, setErrors] = useState({
    phone: '',
    email: '',
    name: ''
  });
  const [customModal, setCustomModal] = useState({
    isOpen: false,
    type: 'info' as 'success' | 'warning' | 'info' | 'confirm',
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Aceptar',
    cancelText: 'Cancelar'
  });

  // Sincronizar localMembership con la prop membership
  useEffect(() => {
    setLocalMembership(membership);
  }, [membership]);
  const [formData, setFormData] = useState({
    client_name: membership?.client_name || '',
    client_phone: membership?.client_phone || '',
    client_email: membership?.client_email || '',
    membership_type: membership?.membership_type || 'individual' as 'individual' | 'combo' | 'personalizada',
    plan_name: membership?.plan_name || 'completa' as 'esencial' | 'completa' | 'platinum',
    areas: membership?.areas || [] as Area[],
    monthly_payment: membership?.monthly_payment || 0,
    initial_payment: membership?.initial_payment || 0,
    total_sessions: membership?.total_sessions || 9,
    start_date: membership?.start_date || new Date().toISOString().split('T')[0],
    notes: membership?.notes || ''
  });

  const handleCalculatorChange = (calculation: {
    areas: Area[];
    membershipType: 'individual' | 'personalizada' | 'combo';
    planName: 'esencial' | 'completa' | 'platinum';
    monthlyPayment: number;
    initialPayment: number;
    totalSessions: number;
  }) => {
    setFormData(prev => ({
      ...prev,
      areas: calculation.areas,
      membership_type: calculation.membershipType,
      plan_name: calculation.planName,
      monthly_payment: calculation.monthlyPayment,
      initial_payment: calculation.initialPayment,
      total_sessions: calculation.totalSessions
    }));
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
      return 'El teléfono es obligatorio';
    }
    if (!phoneRegex.test(phone)) {
      return 'El teléfono debe tener exactamente 10 dígitos';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'El email es obligatorio';
    }
    if (!emailRegex.test(email)) {
      return 'Ingresa un email válido';
    }
    return '';
  };

  const validateFullName = (name: string) => {
    if (!name.trim()) {
      return 'El nombre completo es obligatorio';
    }
    
    // Dividir por espacios y filtrar elementos vacíos
    const nameParts = name.trim().split(/\s+/);
    
    if (nameParts.length < 3) {
      return 'Ingresa nombre completo (nombre + 2 apellidos mínimo)';
    }
    
    // Verificar que cada parte tenga al menos 2 caracteres
    for (const part of nameParts) {
      if (part.length < 2) {
        return 'Cada nombre/apellido debe tener al menos 2 caracteres';
      }
    }
    
    return '';
  };
  const handlePhoneChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/\D/g, '');
    // Limitar a 10 dígitos
    const limitedValue = numericValue.slice(0, 10);
    
    setFormData(prev => ({ ...prev, client_phone: limitedValue }));
    
    const phoneError = validatePhone(limitedValue);
    setErrors(prev => ({ ...prev, phone: phoneError }));
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, client_email: value }));
    
    const emailError = validateEmail(value);
    setErrors(prev => ({ ...prev, email: emailError }));
  };

  const handleNameChange = (value: string) => {
    // Remover acentos y convertir a mayúsculas
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    const upperValue = removeAccents(value).toUpperCase();
    setFormData(prev => ({ ...prev, client_name: upperValue }));
    
    const nameError = validateFullName(upperValue);
    setErrors(prev => ({ ...prev, name: nameError }));
  };

  const undoSessionCompleted = () => {
    if (!localMembership) return;
    
    if (localMembership.completed_sessions <= 0) {
      setCustomModal({
        isOpen: true,
        type: 'info',
        title: 'Sin Sesiones para Deshacer',
        message: 'No hay sesiones completadas para deshacer.',
        onConfirm: () => {},
        confirmText: 'Entendido',
        cancelText: ''
      });
      return;
    }

    setCustomModal({
      isOpen: true,
      type: 'confirm',
      title: 'Confirmar Deshacer Sesión',
      message: `¿Estás seguro de que quieres deshacer una sesión completada?\n\nSesiones actuales: ${localMembership.completed_sessions}/${localMembership.total_sessions}`,
      onConfirm: () => executeUndoSessionInForm(),
      confirmText: 'Deshacer Sesión',
      cancelText: 'Cancelar'
    });
  };

  const executeUndoSessionInForm = async () => {
    if (!localMembership) return;

    try {
      const newCompletedSessions = localMembership.completed_sessions - 1;
      const newStatus = localMembership.status === 'completada' && newCompletedSessions < localMembership.total_sessions 
        ? 'activa' 
        : localMembership.status;

      const { error } = await supabase!
        .from('memberships')
        .update({ 
          completed_sessions: newCompletedSessions,
          status: newStatus
        })
        .eq('id', localMembership.id);

      if (error) throw error;

      // Actualizar localMembership para reflejar los cambios inmediatamente en la UI
      const updatedMembership = {
        ...localMembership,
        completed_sessions: newCompletedSessions,
        status: newStatus
      };
      setLocalMembership(updatedMembership);
      
      setCustomModal({
        isOpen: true,
        type: 'success',
        title: '¡Sesión Deshecha!',
        message: `¡Perfecto! La sesión ha sido deshecha exitosamente.\n\nSesiones actuales: ${newCompletedSessions}/${localMembership.total_sessions}`,
        onConfirm: () => {
          onSuccess(); // Esto recargará las membresías en el componente padre
        },
        confirmText: 'Excelente',
        cancelText: ''
      });
    } catch (error: any) {
      console.error('Error al deshacer sesión:', error);
      setCustomModal({
        isOpen: true,
        type: 'warning',
        title: 'Error',
        message: 'Ocurrió un error al deshacer la sesión. Por favor, inténtalo de nuevo.',
        onConfirm: () => {},
        confirmText: 'Entendido',
        cancelText: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar antes de enviar
    const phoneError = validatePhone(formData.client_phone);
    const emailError = validateEmail(formData.client_email);
    const nameError = validateFullName(formData.client_name);
    
    setErrors({
      phone: phoneError,
      email: emailError,
      name: nameError
    });
    
    if (phoneError || emailError || nameError) {
      return;
    }
    
    setLoading(true);

    try {
      let error;
      if (membership) {
        // Actualizar membresía existente - preservar completed_sessions y status actuales
        const updateData = {
          client_name: formData.client_name,
          client_phone: formData.client_phone,
          client_email: formData.client_email || null,
          membership_type: formData.membership_type,
          plan_name: formData.plan_name,
          areas: formData.areas,
          monthly_payment: formData.monthly_payment,
          initial_payment: formData.initial_payment,
          total_sessions: formData.total_sessions,
          start_date: formData.start_date,
          notes: formData.notes || null
          // NO incluir completed_sessions ni status para preservar los valores actuales
        };
        
        ({ error } = await supabase!
          .from('memberships')
          .update(updateData)
          .eq('id', membership.id));

        // Si la actualización de membresía fue exitosa, sincronizar con la tabla clients
        if (!error) {
          try {
            // Buscar el cliente por email original de la membresía
            const { data: existingClient, error: clientCheckError } = await supabase!
              .from('clients')
              .select('id')
              .eq('email', membership.client_email)
              .maybeSingle();

            if (!clientCheckError && existingClient) {
              // Actualizar la información del cliente
              const { error: updateClientError } = await supabase!
                .from('clients')
                .update({
                  name: formData.client_name,
                  email: formData.client_email,
                  phone: formData.client_phone
                })
                .eq('id', existingClient.id);

              if (updateClientError) {
                console.error('Error updating client from membership:', updateClientError);
              } else {
                // Emitir evento para notificar a ClientsSection sobre la actualización
                window.dispatchEvent(new CustomEvent('membershipUpdated', {
                  detail: {
                    originalEmail: membership.client_email,
                    updatedClient: {
                      name: formData.client_name,
                      email: formData.client_email,
                      phone: formData.client_phone
                    }
                  }
                }));
              }
            }
          } catch (clientSyncError) {
            console.error('Error syncing client data from membership update:', clientSyncError);
            // No fallar la actualización de membresía por errores de sincronización
          }
        }
      } else {
        // Crear nueva membresía
        const membershipData = {
          client_name: formData.client_name,
          client_phone: formData.client_phone,
          client_email: formData.client_email || null,
          membership_type: formData.membership_type,
          plan_name: formData.plan_name,
          areas: formData.areas,
          monthly_payment: formData.monthly_payment,
          initial_payment: formData.initial_payment,
          total_sessions: formData.total_sessions,
          completed_sessions: 0,
          start_date: formData.start_date,
          status: 'activa',
          notes: formData.notes || null
        };
        
        ({ error } = await supabase!.from('memberships').insert([membershipData]));
      }

      if (error) throw error;

      // Si es una nueva membresía, crear o actualizar el cliente en la tabla clients
      if (!membership) {
        try {
          // Verificar si el cliente ya existe
          const { data: existingClient, error: clientCheckError } = await supabase!
            .from('clients')
            .select('id')
            .eq('email', formData.client_email)
            .maybeSingle();

          if (clientCheckError && clientCheckError.code !== 'PGRST116') {
            console.error('Error checking client:', clientCheckError);
          }

          if (!existingClient) {
            // Cliente no existe, crearlo
            const { error: createClientError } = await supabase!
              .from('clients')
              .insert([{
                name: formData.client_name,
                email: formData.client_email,
                phone: formData.client_phone,
                points: 0
              }]);

            if (createClientError) {
              console.error('Error creating client:', createClientError);
            }
          } else {
            // Cliente existe, actualizar información si es necesario
            const { error: updateClientError } = await supabase!
              .from('clients')
              .update({
                name: formData.client_name,
                phone: formData.client_phone
              })
              .eq('id', existingClient.id);

            if (updateClientError) {
              console.error('Error updating client:', updateClientError);
            }
          }
        } catch (clientError) {
          console.error('Client operation error:', clientError);
          // No fallar la creación de membresía por errores de cliente
        }
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating membership:', error);
      alert(`Error al ${membership ? 'actualizar' : 'crear'} la membresía: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {localMembership ? 'Editar Membresía' : 'Nueva Membresía'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Información del Cliente
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff] ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="EJ: MARIA GONZALEZ LOPEZ"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Nombre + 2 apellidos mínimo</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff] ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="4433110777"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Solo números, 10 dígitos</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.client_email}
                  onChange={(e) => handleEmailChange(e.target.value.toLowerCase())}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff] ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="cliente@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Membresía */}
          {/* Calculadora de Membresías */}
          {!localMembership && (
            <MembershipCalculator
              onCalculationChange={handleCalculatorChange}
              initialAreas={formData.areas}
              initialPlan={formData.plan_name}
            />
          )}

          {/* Botón para deshacer sesión */}
          {localMembership && localMembership.completed_sessions > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <button
                type="button"
                onClick={undoSessionCompleted}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Minus size={16} />
                Deshacer Sesión Completada
              </button>
              <p className="text-xs text-orange-600 mt-2">
                Sesiones completadas: {localMembership.completed_sessions}/{localMembership.total_sessions}
              </p>
            </div>
          )}

          {/* Preview del Resumen de Cálculo */}
          {membership && (
            <div className="bg-[#37b7ff]/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="mr-2" size={20} />
                Resumen de Cálculo
              </h3>
              <MembershipSummary
                areas={formData.areas}
                membershipType={formData.membership_type}
                planName={formData.plan_name}
                monthlyPayment={formData.monthly_payment}
                initialPayment={formData.initial_payment}
                totalSessions={formData.total_sessions}
              />
            </div>
          )}

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
              placeholder="Observaciones, descuentos especiales, etc."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || (!membership && formData.areas.length === 0) || !!errors.phone || !!errors.email || !!errors.name}
              className="px-6 py-2 bg-[#37b7ff] text-white rounded-lg hover:bg-[#2da7ef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>{membership ? 'Actualizar Membresía' : 'Crear Membresía'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <CustomModal
        isOpen={customModal.isOpen}
        onClose={() => setCustomModal({ ...customModal, isOpen: false })}
        onConfirm={() => {
          customModal.onConfirm();
          setCustomModal({ ...customModal, isOpen: false });
        }}
        title={customModal.title}
        message={customModal.message}
        type={customModal.type}
        confirmText={customModal.confirmText}
        cancelText={customModal.cancelText}
      />
    </div>
  );
};

export default MembershipForm;