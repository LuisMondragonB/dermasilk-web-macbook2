import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut, 
  BarChart3,
  UserPlus,
  Crown,
  Shield,
  Home,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import MembershipsSection from '../components/Admin/MembershipsSection';
import RewardsSection from '../components/Admin/RewardsSection';
import ClientsSection from '../components/Admin/ClientsSection';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('memberships');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: 'memberships',
      name: 'Membresías',
      icon: Crown,
      description: 'Gestionar membresías de clientes'
    },
    {
      id: 'clients',
      name: 'Clientes',
      icon: Users,
      description: 'Base de datos de clientes'
    },
    {
      id: 'rewards',
      name: 'Recompensas',
      icon: Award,
      description: 'Sistema de puntos y recompensas'
    },
    {
      id: 'appointments',
      name: 'Citas',
      icon: Calendar,
      description: 'Programar y gestionar citas'
    },
    {
      id: 'payments',
      name: 'Pagos',
      icon: CreditCard,
      description: 'Control de pagos y facturación'
    },
    {
      id: 'analytics',
      name: 'Reportes',
      icon: BarChart3,
      description: 'Estadísticas y análisis'
    },
    {
      id: 'settings',
      name: 'Configuración',
      icon: Settings,
      description: 'Ajustes del sistema'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'memberships':
        return <MembershipsSection />;
      case 'clients':
        return <ClientsSection />;
      case 'rewards':
        return <RewardsSection />;
      case 'appointments':
        return (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Citas</h3>
            <p className="text-gray-600">Funcionalidad en desarrollo</p>
          </div>
        );
      case 'payments':
        return (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Control de Pagos</h3>
            <p className="text-gray-600">Funcionalidad en desarrollo</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reportes y Análisis</h3>
            <p className="text-gray-600">Funcionalidad en desarrollo</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración</h3>
            <p className="text-gray-600">Funcionalidad en desarrollo</p>
          </div>
        );
      default:
        return <MembershipsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-2 bg-[#37b7ff] rounded-lg mr-3">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">Derma</span>
                    <span className="text-2xl font-bold text-[#37b7ff]">silk</span>
                    <span className="text-xs font-normal text-gray-500 ml-1">®</span>
                  </div>
                  <div className="text-xs text-gray-500">Panel de Administración</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
              >
                <Home size={20} />
                <span>Ver Sitio</span>
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <LogOut size={16} />
                <span>{loading ? 'Cerrando...' : 'Cerrar Sesión'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#37b7ff] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs ${
                      activeSection === item.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;