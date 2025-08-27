import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, Calendar, Award, User, X, MessageCircle, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CustomModal from './CustomModal';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  points: number | null;
  created_at: string;
  membershipCount?: number;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  points: number;
}

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    points: 0
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Estados para el sistema de PIN
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Estado para el modal personalizado
  const [customModal, setCustomModal] = useState({
    isOpen: false,
    type: 'info' as 'info' | 'warning' | 'success' | 'confirm',
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Aceptar',
    cancelText: 'Cancelar'
  });

  const fetchClients = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Obtener el conteo de membresías para cada cliente
      const clientsWithMembershipCount = await Promise.all(
        (data || []).map(async (client) => {
          if (!supabase) {
            return { ...client, membershipCount: 0 };
          }
          
          const { count, error: countError } = await supabase
            .from('memberships')
            .select('*', { count: 'exact', head: true })
            .eq('client_name', client.name);
          
          if (countError) {
            console.error('Error counting memberships for client:', client.name, countError);
            return { ...client, membershipCount: 0 };
          }
          
          return { ...client, membershipCount: count || 0 };
        })
      );
      
      setClients(clientsWithMembershipCount);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Escuchar eventos de actualización de membresías para recargar clientes
  useEffect(() => {
    const handleMembershipUpdated = () => {
      fetchClients();
    };

    window.addEventListener('membershipUpdated', handleMembershipUpdated);

    return () => {
      window.removeEventListener('membershipUpdated', handleMembershipUpdated);
    };
  }, []);

  // Verificar bloqueo del PIN al cargar el componente
  useEffect(() => {
    const savedBlockEndTime = localStorage.getItem('clientsPinBlockEndTime');
    if (savedBlockEndTime) {
      const endTime = parseInt(savedBlockEndTime);
      const now = Date.now();
      if (now < endTime) {
        setIsBlocked(true);
        setBlockEndTime(endTime);
        setRemainingTime(Math.ceil((endTime - now) / 1000));
      } else {
        localStorage.removeItem('clientsPinBlockEndTime');
        localStorage.removeItem('clientsPinAttempts');
      }
    }
    
    // Recuperar intentos guardados
    const savedAttempts = localStorage.getItem('clientsPinAttempts');
    if (savedAttempts) {
      setPinAttempts(parseInt(savedAttempts));
    }
  }, []);

  // Timer para el bloqueo del PIN
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBlocked && blockEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((blockEndTime - now) / 1000);
        
        if (remaining <= 0) {
          setIsBlocked(false);
          setBlockEndTime(null);
          setPinAttempts(0);
          setRemainingTime(0);
          localStorage.removeItem('clientsPinBlockEndTime');
          localStorage.removeItem('clientsPinAttempts');
        } else {
          setRemainingTime(remaining);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlocked, blockEndTime]);

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return client.name.toLowerCase().includes(searchLower) ||
           client.email.toLowerCase().includes(searchLower) ||
           (client.phone && client.phone.includes(searchTerm));
  });

  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'El nombre es obligatorio';
    }
    const nameParts = name.trim().split(/\s+/);
    // Requerir: nombre + 2 apellidos mínimo (3 partes)
    if (nameParts.length < 3) {
      return 'Ingresa nombre completo (nombre + 2 apellidos mínimo)';
    }
    // Cada parte al menos 2 caracteres
    for (const part of nameParts) {
      if (part.length < 2) {
        return 'Cada nombre/apellido debe tener al menos 2 caracteres';
      }
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

  const handleNameChange = (value: string) => {
    // Remover acentos y convertir a mayúsculas para mantener consistencia con MembershipForm
    const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const upperValue = removeAccents(value).toUpperCase();
    setFormData(prev => ({ ...prev, name: upperValue }));
    const nameError = validateName(upperValue);
    setErrors(prev => ({ ...prev, name: nameError }));
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    const emailError = validateEmail(value);
    setErrors(prev => ({ ...prev, email: emailError }));
  };

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const limitedValue = numericValue.slice(0, 10);
    setFormData(prev => ({ ...prev, phone: limitedValue }));
    const phoneError = validatePhone(limitedValue);
    setErrors(prev => ({ ...prev, phone: phoneError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    
    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError
    });
    
    if (nameError || emailError || phoneError) {
      return;
    }

    try {
      if (!supabase) {
        setCustomModal({
          isOpen: true,
          type: 'warning',
          title: 'Error de Configuración',
          message: 'Supabase no está configurado.',
          onConfirm: () => setCustomModal(prev => ({ ...prev, isOpen: false })),
          confirmText: 'Entendido',
          cancelText: ''
        });
        return;
      }
      const clientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        points: formData.points
      };

      let error;
      if (selectedClient) {
        ({ error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', selectedClient.id));
      } else {
        ({ error } = await supabase
          .from('clients')
          .insert([clientData]));
      }

      if (error) throw error;

      // Si se actualizó un cliente existente, sincronizar con membresías
      if (selectedClient) {
        try {
          // Actualizar información del cliente en todas sus membresías
          const { error: membershipUpdateError } = await supabase
            .from('memberships')
            .update({
              client_name: clientData.name,
              client_phone: clientData.phone,
              client_email: clientData.email
            })
            .eq('client_email', selectedClient.email);

          if (membershipUpdateError) {
            console.error('Error updating memberships:', membershipUpdateError);
            // No fallar la actualización del cliente por errores en membresías
          } else {
            // Emitir evento para notificar que se actualizó un cliente
            window.dispatchEvent(new CustomEvent('clientUpdated', {
              detail: { 
                oldEmail: selectedClient.email,
                newClientData: clientData 
              }
            }));
          }
        } catch (syncError) {
          console.error('Error syncing client data with memberships:', syncError);
        }
      }

      await fetchClients();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving client:', error);
      setCustomModal({
        isOpen: true,
        type: 'warning',
        title: 'Error al Guardar',
        message: 'Ocurrió un error al guardar el cliente. Por favor intenta nuevamente.',
        onConfirm: () => setCustomModal(prev => ({ ...prev, isOpen: false })),
        confirmText: 'Entendido',
        cancelText: ''
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      points: 0
    });
    setErrors({
      name: '',
      email: '',
      phone: ''
    });
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      points: client.points || 0
    });
    setShowForm(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (isBlocked) {
      setCustomModal({
        isOpen: true,
        type: 'warning',
        title: 'Acceso Bloqueado',
        message: `Acceso bloqueado por seguridad. Intenta nuevamente en ${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')} minutos.`,
        onConfirm: () => setCustomModal(prev => ({ ...prev, isOpen: false })),
        confirmText: 'Entendido',
        cancelText: ''
      });
      return;
    }
    
    setClientToDelete(clientId);
    setShowPinModal(true);
    setPinInput('');
    setPinError('');
  };

  const handlePinSubmit = () => {
    if (isBlocked) {
      return;
    }
    
    const correctPin = '9103784';
    
    if (pinInput === correctPin) {
      // PIN correcto - resetear intentos
      setPinAttempts(0);
      localStorage.removeItem('clientsPinAttempts');
      
      confirmDelete();
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      const newAttempts = pinAttempts + 1;
      setPinAttempts(newAttempts);
      localStorage.setItem('clientsPinAttempts', newAttempts.toString());
      
      if (newAttempts >= 3) {
        // Bloquear por 15 minutos
        const blockEnd = Date.now() + (15 * 60 * 1000);
        setIsBlocked(true);
        setBlockEndTime(blockEnd);
        setRemainingTime(15 * 60);
        localStorage.setItem('clientsPinBlockEndTime', blockEnd.toString());
        
        setPinError('Demasiados intentos fallidos. Acceso bloqueado por 15 minutos.');
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          handlePinCancel();
        }, 2000);
      } else {
        const remainingAttempts = 3 - newAttempts;
        setPinError(`PIN incorrecto. Te quedan ${remainingAttempts} intento${remainingAttempts !== 1 ? 's' : ''}.`);
      }
      
      setPinInput('');
    }
  };

  const handlePinCancel = () => {
    setShowPinModal(false);
    setPinInput('');
    setPinError('');
    setClientToDelete(null);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) {
      return;
    }
    
    try {
      if (!supabase) {
        setCustomModal({
          isOpen: true,
          type: 'warning',
          title: 'Error de Configuración',
          message: 'Supabase no está configurado.',
          onConfirm: () => {
            setCustomModal(prev => ({ ...prev, isOpen: false }));
            setClientToDelete(null);
          },
          confirmText: 'Entendido',
          cancelText: ''
        });
        return;
      }
      
      // Obtener los datos del cliente para mostrar información
       const { data: clientData, error: fetchError } = await supabase!
         .from('clients')
         .select('name')
         .eq('id', clientToDelete)
         .single();
         
       if (fetchError) throw fetchError;
       
       // Verificar cuántas membresías tiene el cliente (para información)
       const { count: totalMemberships, error: countError } = await supabase!
         .from('memberships')
         .select('*', { count: 'exact', head: true })
         .eq('client_name', clientData.name);
      
      if (countError) {
        console.warn('Error checking memberships:', countError);
      }
      
      // Mostrar confirmación con información sobre las membresías
      const membershipMessage = totalMemberships && totalMemberships > 0 
        ? `\n\nNOTA: Este cliente tiene ${totalMemberships} membresía${totalMemberships === 1 ? '' : 's'} registrada${totalMemberships === 1 ? '' : 's'}. Las membresías NO se eliminarán automáticamente. Si deseas eliminar también las membresías, deberás hacerlo manualmente desde la sección de Membresías.`
        : '';
      
      setCustomModal({
        isOpen: true,
        type: 'confirm',
        title: 'Confirmar Eliminación de Cliente',
        message: `¿Estás seguro de que quieres eliminar a ${clientData.name}?\n\nEsta acción eliminará ÚNICAMENTE el registro del cliente de la tabla de clientes. Esta acción no se puede deshacer.${membershipMessage}`,
        onConfirm: async () => {
          // Cerrar el modal de confirmación primero
          setCustomModal(prev => ({ ...prev, isOpen: false }));
          
          try {
            // SOLO eliminar de la tabla clients - NUNCA tocar memberships
            const { error: clientError } = await supabase
              .from('clients')
              .delete()
              .eq('id', clientToDelete);

            if (clientError) throw clientError;
            
            await fetchClients();
            
            // Disparar evento para actualizar conteos en otras secciones
            window.dispatchEvent(new Event('membershipUpdated'));
            
            setClientToDelete(null);
            
            setCustomModal({
              isOpen: true,
              type: 'success',
              title: 'Cliente Eliminado',
              message: `${clientData.name} ha sido eliminado de la tabla de clientes. Las membresías asociadas permanecen intactas en el sistema.`,
              onConfirm: () => setCustomModal(prev => ({ ...prev, isOpen: false })),
              confirmText: 'Entendido',
              cancelText: ''
            });
          } catch (error) {
            console.error('Error deleting client:', error);
            setCustomModal({
              isOpen: true,
              type: 'warning',
              title: 'Error al Eliminar',
              message: 'Ocurrió un error al eliminar el cliente. Por favor intenta nuevamente.',
              onConfirm: () => {
                setCustomModal(prev => ({ ...prev, isOpen: false }));
                setClientToDelete(null);
              },
              confirmText: 'Entendido',
              cancelText: ''
            });
          }
        },
        confirmText: 'Eliminar Cliente',
        cancelText: 'Cancelar'
      });
      
    } catch (error) {
      console.error('Error checking client data:', error);
      setCustomModal({
        isOpen: true,
        type: 'warning',
        title: 'Error de Verificación',
        message: 'Ocurrió un error al verificar los datos del cliente. Por favor intenta nuevamente.',
        onConfirm: () => {
          setCustomModal(prev => ({ ...prev, isOpen: false }));
          setClientToDelete(null);
        },
        confirmText: 'Entendido',
        cancelText: ''
      });
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  const handleWhatsAppClick = (client: Client) => {
    const message = encodeURIComponent(
      `¡Hola ${client.name}! Te contactamos desde Dermasilk®. ¿Cómo podemos ayudarte?`
    );
    window.open(`https://wa.me/52${client.phone}?text=${message}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#37b7ff]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600">Gestiona la base de datos de clientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Con Puntos</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter(c => (c.points || 0) > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nuevos Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter(c => {
                  const clientDate = new Date(c.created_at);
                  const now = new Date();
                  return clientDate.getMonth() === now.getMonth() && 
                         clientDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Award className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.reduce((sum, c) => sum + (c.points || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#37b7ff] focus:border-[#37b7ff]"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membresías
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#37b7ff]/10 rounded-full flex items-center justify-center">
                        <User className="text-[#37b7ff]" size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone size={14} className="mr-1 text-gray-400" />
                        {client.phone || 'No registrado'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail size={14} className="mr-1 text-gray-400" />
                        {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Award className="text-yellow-500 mr-2" size={16} />
                      <span className="text-sm font-medium text-gray-900">
                        {client.points || 0} pts
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#37b7ff]/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#37b7ff]">
                          {client.membershipCount || 0}
                        </span>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {client.membershipCount === 1 ? 'membresía' : 'membresías'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(client.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewClient(client)}
                        className="text-[#37b7ff] hover:text-[#2da7ef] transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      {client.phone && (
                        <button 
                          onClick={() => handleWhatsAppClick(client)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditClient(client)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Los clientes aparecerán aquí cuando se registren o creen membresías'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors"
              >
                Agregar Primer Cliente
              </button>
            )}
          </div>
        )}
      </div>

      {/* Client Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff] ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="EJ: MARIA GONZALEZ LOPEZ"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
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
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
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
                    Puntos iniciales
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.points}
                    onChange={(e) => setFormData(prev => ({ ...prev, points: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500">Puntos de recompensa iniciales</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={Boolean(errors.name || errors.email || errors.phone)}
                  className="px-6 py-2 bg-[#37b7ff] text-white rounded-lg hover:bg-[#2da7ef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>{selectedClient ? 'Actualizar' : 'Crear'} Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {showDetails && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Detalles del Cliente</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información Personal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <p className="text-gray-900">{selectedClient.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedClient.email}</p>
                  </div>
                  {selectedClient.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="text-gray-900">{selectedClient.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Registro</label>
                    <p className="text-gray-900">{formatDate(selectedClient.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Puntos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sistema de Recompensas</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Award className="text-yellow-600" size={24} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedClient.points || 0} puntos disponibles
                      </p>
                      <p className="text-sm text-gray-600">
                        Puntos acumulados en el sistema de recompensas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Acciones Rápidas</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedClient.phone && (
                    <button
                      onClick={() => handleWhatsAppClick(selectedClient)}
                      className="flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                    >
                      <MessageCircle className="text-green-600" size={20} />
                      <span className="text-green-800 font-medium">Contactar por WhatsApp</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      handleEditClient(selectedClient);
                    }}
                    className="flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                  >
                    <Edit className="text-blue-600" size={20} />
                    <span className="text-blue-800 font-medium">Editar Información</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Lock className="text-red-600" size={20} />
                <h2 className="text-xl font-bold text-gray-900">PIN de Seguridad</h2>
              </div>
              <button
                onClick={handlePinCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Ingresa el PIN de seguridad para eliminar el cliente:
              </p>
              
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg tracking-widest"
                placeholder="Ingresa el PIN"
                maxLength={7}
                disabled={isBlocked}
              />
              
              {pinError && (
                <p className="mt-3 text-sm text-red-600 text-center">{pinError}</p>
              )}
              
              {isBlocked && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 text-center">
                    Acceso bloqueado por seguridad.
                  </p>
                  <p className="text-sm text-red-600 text-center mt-1">
                    Tiempo restante: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handlePinCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePinSubmit}
                  disabled={!pinInput.trim() || isBlocked}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal personalizado */}
      <CustomModal
        isOpen={customModal.isOpen}
        type={customModal.type}
        title={customModal.title}
        message={customModal.message}
        onConfirm={customModal.onConfirm}
        onClose={() => {
          setCustomModal(prev => ({ ...prev, isOpen: false }));
          // Limpiar clientToDelete si se cancela la eliminación
          if (clientToDelete) {
            setClientToDelete(null);
          }
        }}
        confirmText={customModal.confirmText}
        cancelText={customModal.cancelText}
      />
    </div>
  );
};

export default ClientsSection;