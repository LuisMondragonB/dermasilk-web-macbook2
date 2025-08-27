import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Award, Star, Gift, Crown, Sparkles, Users, TrendingUp, Calendar, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RewardItem {
  id: string;
  name: string;
  description: string | null;
  points_required: number;
  category: string;
  active: boolean;
  created_at: string;
}

interface RewardTransaction {
  id: string;
  client_id: string;
  points: number;
  transaction_type: 'earned' | 'redeemed';
  reason: string;
  description: string | null;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

const RewardsSection = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [clientForPoints, setClientForPoints] = useState<any>(null);
  const [pointsForm, setPointsForm] = useState({
    points: 0,
    transactionType: 'earned' as 'earned' | 'redeemed',
    reason: '',
    description: ''
  });
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [searchClientTerm, setSearchClientTerm] = useState('');

  // Estados para el modal de canje
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [selectedRedemptionClient, setSelectedRedemptionClient] = useState<any>(null);
  const [selectedRedemptionReward, setSelectedRedemptionReward] = useState<RewardItem | null>(null);
  const [redemptionForm, setRedemptionForm] = useState({
    clientId: '',
    rewardId: '',
    description: ''
  });
  const [searchRedemptionClientTerm, setSearchRedemptionClientTerm] = useState('');

  const [rewardForm, setRewardForm] = useState({
    name: '',
    description: '',
    points_required: 0,
    category: 'descuentos',
    active: true
  });

  const categories = [
    { value: 'descuentos', label: 'Descuentos', icon: Star, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'servicios', label: 'Servicios Gratis', icon: Gift, color: 'bg-green-100 text-green-800' },
    { value: 'productos', label: 'Productos', icon: Sparkles, color: 'bg-purple-100 text-purple-800' },
    { value: 'vip', label: 'Beneficios VIP', icon: Crown, color: 'bg-blue-100 text-blue-800' }
  ];

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase!
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase!
        .from('rewards_catalog')
        .select('*')
        .order('points_required', { ascending: true });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase!
        .from('rewards_transactions')
        .select(`
          *,
          clients(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRewards(), fetchTransactions(), fetchClients()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchClientTerm))
  );

  const filteredRedemptionClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchRedemptionClientTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchRedemptionClientTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchRedemptionClientTerm))
  );

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reward.description && reward.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || reward.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleManualPointsClick = () => {
    setShowPointsModal(true);
    setClientForPoints(null);
    setSelectedClientId('');
    setSearchClientTerm('');
    setPointsForm({
      points: 0,
      transactionType: 'earned',
      reason: '',
      description: ''
    });
  };

  const handleProcessRedemption = () => {
    setShowRedemptionModal(true);
    setSelectedRedemptionClient(null);
    setSelectedRedemptionReward(null);
    setRedemptionForm({
      clientId: '',
      rewardId: '',
      description: ''
    });
    setSearchRedemptionClientTerm('');
  };

  const handleRedemptionSubmit = async () => {
    if (!redemptionForm.clientId || !redemptionForm.rewardId) {
      alert('Por favor selecciona un cliente y una recompensa');
      return;
    }

    const client = clients.find(c => c.id === redemptionForm.clientId);
    const reward = rewards.find(r => r.id === redemptionForm.rewardId);

    if (!client || !reward) {
      alert('Cliente o recompensa no encontrados');
      return;
    }

    try {
      // Atomic RPC: decrementa puntos y registra transacción
      const { data: newTotal, error: rpcError } = await supabase!.rpc('increment_points', {
        p_client_id: redemptionForm.clientId,
        p_points: reward.points_required,
        p_type: 'redeemed',
        p_reason: `Canje: ${reward.name}`,
        p_description: redemptionForm.description || null
      });
      if (rpcError) throw rpcError;

      alert(`¡Canje exitoso! ${client.name} canjeó ${reward.points_required} puntos por: ${reward.name}`);
      setShowRedemptionModal(false);
      setSelectedRedemptionClient(null);
      setSelectedRedemptionReward(null);
      setRedemptionForm({
        clientId: '',
        rewardId: '',
        description: ''
      });
      setSearchRedemptionClientTerm('');
      
      // Refrescar datos
      await Promise.all([fetchTransactions(), fetchClients()]);
    } catch (error) {
      console.error('Error processing redemption:', error);
      alert('Error al procesar el canje');
    }
  };

  const handleCancelRedemption = () => {
    setShowRedemptionModal(false);
    setSelectedRedemptionClient(null);
    setSelectedRedemptionReward(null);
    setRedemptionForm({
      clientId: '',
      rewardId: '',
      description: ''
    });
    setSearchRedemptionClientTerm('');
  };

  const handleAddPoints = async () => {
    if (!selectedClientId || pointsForm.points <= 0 || !pointsForm.reason || !pointsForm.transactionType) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      // Atomic RPC: suma o resta y registra transacción
      const { data: newTotal, error: rpcError } = await supabase!.rpc('increment_points', {
        p_client_id: selectedClientId,
        p_points: pointsForm.points,
        p_type: pointsForm.transactionType,
        p_reason: pointsForm.reason,
        p_description: pointsForm.description || null
      });
      if (rpcError) throw rpcError;

      const selectedClient = clients.find(c => c.id === selectedClientId);
      const actionText = pointsForm.transactionType === 'earned' ? 'recibió' : 'perdió';
      alert(`¡Transacción exitosa! ${selectedClient?.name} ${actionText} ${pointsForm.points} puntos.`);
      setShowPointsModal(false);
      setClientForPoints(null);
      setSelectedClientId('');
      setSearchClientTerm('');
      setPointsForm({
        points: 0,
        transactionType: 'earned',
        reason: '',
        description: ''
      });
      
      // Refrescar datos
      await Promise.all([fetchTransactions(), fetchClients()]);
    } catch (error) {
      console.error('Error adding points:', error);
      alert('Error al otorgar puntos');
    }
  };

  const handleCancelPoints = () => {
    setShowPointsModal(false);
    setClientForPoints(null);
    setSelectedClientId('');
    setSearchClientTerm('');
    setPointsForm({
      points: 0,
      transactionType: 'earned',
      reason: '',
      description: ''
    });
  };

  const handleSubmitReward = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const rewardData = {
        name: rewardForm.name,
        description: rewardForm.description || null,
        points_required: rewardForm.points_required,
        category: rewardForm.category,
        active: rewardForm.active
      };

      let error;
      if (selectedReward) {
        ({ error } = await supabase!
          .from('rewards_catalog')
          .update(rewardData)
          .eq('id', selectedReward.id));
      } else {
        ({ error } = await supabase!
          .from('rewards_catalog')
          .insert([rewardData]));
      }

      if (error) throw error;

      await fetchRewards();
      setShowRewardForm(false);
      setSelectedReward(null);
      setRewardForm({
        name: '',
        description: '',
        points_required: 0,
        category: 'descuentos',
        active: true
      });
    } catch (error) {
      console.error('Error saving reward:', error);
      alert('Error al guardar la recompensa');
    }
  };

  const handleEditReward = (reward: RewardItem) => {
    setSelectedReward(reward);
    setRewardForm({
      name: reward.name,
      description: reward.description || '',
      points_required: reward.points_required,
      category: reward.category,
      active: reward.active
    });
    setShowRewardForm(true);
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta recompensa?')) {
      try {
        const { error } = await supabase!
          .from('rewards_catalog')
          .delete()
          .eq('id', rewardId);

        if (error) throw error;
        await fetchRewards();
      } catch (error) {
        console.error('Error deleting reward:', error);
        alert('Error al eliminar la recompensa');
      }
    }
  };

  const toggleRewardStatus = async (rewardId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase!
        .from('rewards_catalog')
        .update({ active: !currentStatus })
        .eq('id', rewardId);

      if (error) throw error;
      await fetchRewards();
    } catch (error) {
      console.error('Error updating reward status:', error);
      alert('Error al actualizar el estado');
    }
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Recompensas</h2>
          <p className="text-gray-600">Gestiona puntos, transacciones y catálogo de recompensas</p>
        </div>
        {activeTab === 'catalog' && (
          <button
            onClick={() => setShowRewardForm(true)}
            className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nueva Recompensa</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Award className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions
                  .filter(t => t.transaction_type === 'earned')
                  .reduce((sum, t) => sum + t.points, 0) -
                 transactions
                  .filter(t => t.transaction_type === 'redeemed')
                  .reduce((sum, t) => sum + t.points, 0)
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes con Puntos</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(transactions.map(t => t.client_id)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Canjes del Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => 
                  t.transaction_type === 'redeemed' && 
                  new Date(t.created_at).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Gift className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recompensas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {rewards.filter(r => r.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'catalog'
                  ? 'border-[#37b7ff] text-[#37b7ff]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Catálogo de Recompensas
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'border-[#37b7ff] text-[#37b7ff]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Transacciones Recientes
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#37b7ff] text-[#37b7ff]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Configuración
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Catalog Tab */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar recompensas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rewards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward) => {
                  const categoryInfo = getCategoryInfo(reward.category);
                  return (
                    <div
                      key={reward.id}
                      className={`bg-white border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
                        reward.active ? 'border-gray-200' : 'border-gray-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                          {React.createElement(categoryInfo.icon, { size: 24 })}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reward.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {reward.active ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">{reward.name}</h3>
                      {reward.description && (
                        <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-[#37b7ff]">
                          {reward.points_required} pts
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditReward(reward)}
                          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit size={16} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => toggleRewardStatus(reward.id, reward.active)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            reward.active
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {reward.active ? 'Pausar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => handleDeleteReward(reward.id)}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredRewards.length === 0 && (
                <div className="text-center py-12">
                  <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recompensas</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || categoryFilter !== 'all' 
                      ? 'No se encontraron recompensas con los filtros aplicados'
                      : 'Comienza creando tu primera recompensa'
                    }
                  </p>
                  {!searchTerm && categoryFilter === 'all' && (
                    <button
                      onClick={() => setShowRewardForm(true)}
                      className="bg-[#37b7ff] text-white px-4 py-2 rounded-lg hover:bg-[#2da7ef] transition-colors"
                    >
                      Crear Primera Recompensa
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Puntos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Razón
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.client?.name || 'Cliente no encontrado'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.client?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.transaction_type === 'earned'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.transaction_type === 'earned' ? 'Ganados' : 'Canjeados'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-bold ${
                            transaction.transaction_type === 'earned'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {transaction.transaction_type === 'earned' ? '+' : '-'}{transaction.points} pts
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{transaction.reason}</div>
                          {transaction.description && (
                            <div className="text-sm text-gray-500">{transaction.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay transacciones</h3>
                  <p className="text-gray-600">Las transacciones de puntos aparecerán aquí</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Formas de Ganar Puntos</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Referir amigas</span>
                      <span className="font-bold text-[#37b7ff]">+100 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Reseñas 5 estrellas</span>
                      <span className="font-bold text-[#37b7ff]">+50 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Fotos antes/después</span>
                      <span className="font-bold text-[#37b7ff]">+50 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Completar membresía</span>
                      <span className="font-bold text-[#37b7ff]">+200 pts</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={handleManualPointsClick}
                      className="w-full text-left p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                      <div className="font-medium text-gray-900">Gestionar Puntos Manualmente</div>
                      <div className="text-sm text-gray-500">Agregar o quitar puntos a un cliente específico</div>
                    </button>
                    <button 
                      onClick={handleProcessRedemption}
                      className="w-full text-left p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                      <div className="font-medium text-gray-900">Procesar Canje</div>
                      <div className="text-sm text-gray-500">Canjear puntos por recompensas</div>
                    </button>
                    <button className="w-full text-left p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                      <div className="font-medium text-gray-900">Historial de Cliente</div>
                      <div className="text-sm text-gray-500">Ver puntos y transacciones por cliente</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Points Modal */}
      {showPointsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Gestionar Puntos Manualmente
              </h2>
              <button
                onClick={handleCancelPoints}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Selección de Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Cliente *
                </label>
                
                {/* Buscador de clientes */}
                <div className="mb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar cliente por nombre, email o teléfono..."
                      value={searchClientTerm}
                      onChange={(e) => setSearchClientTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                    />
                  </div>
                </div>

                {/* Lista de clientes */}
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className={`p-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                          selectedClientId === client.id ? 'bg-[#37b7ff]/10 border-[#37b7ff]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{client.name}</div>
                            <div className="text-xs text-gray-500">{client.email}</div>
                            {client.phone && (
                              <div className="text-xs text-gray-500">{client.phone}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-[#37b7ff]">
                              {client.points || 0} pts
                            </div>
                            {selectedClientId === client.id && (
                              <div className="text-xs text-[#37b7ff]">✓ Seleccionado</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      {searchClientTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                    </div>
                  )}
                </div>
              </div>

              {/* Formulario de puntos */}
              <div className="space-y-3">
                {/* Tipo de transacción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de transacción *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPointsForm(prev => ({ ...prev, transactionType: 'earned' }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        pointsForm.transactionType === 'earned'
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          pointsForm.transactionType === 'earned' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="font-medium text-sm">Otorgar Puntos</span>
                      </div>
                      <p className="text-xs mt-1 opacity-75">Agregar puntos al cliente</p>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPointsForm(prev => ({ ...prev, transactionType: 'redeemed' }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        pointsForm.transactionType === 'redeemed'
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          pointsForm.transactionType === 'redeemed' ? 'bg-red-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="font-medium text-sm">Quitar Puntos</span>
                      </div>
                      <p className="text-xs mt-1 opacity-75">Descontar puntos del cliente</p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad de puntos *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={pointsForm.points || ''}
                    onChange={(e) => setPointsForm(prev => ({ ...prev, points: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón *
                  </label>
                  <select
                    required
                    value={pointsForm.reason}
                    onChange={(e) => setPointsForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                  >
                    <option value="">Seleccionar razón</option>
                    <option value="referir_amigas">Referir amigas (+100 puntos)</option>
                    <option value="resena_5_estrellas">Reseña 5 estrellas (+50 puntos)</option>
                    <option value="fotos_antes_despues">Fotos antes/después (+50 puntos)</option>
                    <option value="completar_membresia">Completar membresía (+200 puntos)</option>
                    <option value="Bonus especial">Bonus especial</option>
                    <option value="Compensación">Compensación</option>
                    <option value="Promoción">Promoción</option>
                    <option value="Otro">Otro</option>
                    <option value="Canje de recompensa">Canje de recompensa</option>
                    <option value="Corrección de error">Corrección de error</option>
                    <option value="Penalización">Penalización</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción adicional
                </label>
                <textarea
                  value={pointsForm.description}
                  onChange={(e) => setPointsForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                  placeholder={`Detalles adicionales sobre por qué se ${pointsForm.transactionType === 'earned' ? 'otorgan' : 'quitan'} estos puntos...`}
                />
              </div>

              {/* Resumen */}
              {selectedClientId && pointsForm.points > 0 && (
                <div className={`border rounded-lg p-4 ${
                  pointsForm.transactionType === 'earned'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <Award className={`flex-shrink-0 mt-1 ${
                      pointsForm.transactionType === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`} size={20} />
                    <div>
                      <p className={`font-medium text-sm ${
                        pointsForm.transactionType === 'earned' ? 'text-green-800' : 'text-red-800'
                      }`}>Resumen de la transacción</p>
                      <p className={`text-xs mt-1 ${
                        pointsForm.transactionType === 'earned' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        Se {pointsForm.transactionType === 'earned' ? 'otorgarán' : 'quitarán'}{' '}
                        <span className="font-bold">{pointsForm.points} puntos</span>{' '}
                        {pointsForm.transactionType === 'earned' ? 'a' : 'de'}{' '}
                        <span className="font-bold">
                          {clients.find(c => c.id === selectedClientId)?.name}
                        </span>
                        {pointsForm.reason && (
                          <span> por: <span className="font-medium">{pointsForm.reason}</span></span>
                        )}
                      </p>
                      {pointsForm.transactionType === 'redeemed' && (
                        <p className="text-xs text-red-600 mt-2">
                          Puntos actuales: {clients.find(c => c.id === selectedClientId)?.points || 0}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelPoints}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddPoints}
                  disabled={!selectedClientId || pointsForm.points <= 0 || !pointsForm.reason || !pointsForm.transactionType}
                  className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                    pointsForm.transactionType === 'earned'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-sm`}
                >
                  <Award size={16} />
                  <span>{pointsForm.transactionType === 'earned' ? 'Otorgar Puntos' : 'Quitar Puntos'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redemption Modal */}
      {showRedemptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Procesar Canje de Recompensa
              </h2>
              <button
                onClick={handleCancelRedemption}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Selección de Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Cliente *
                </label>
                
                <div className="mb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar cliente..."
                      value={searchRedemptionClientTerm}
                      onChange={(e) => setSearchRedemptionClientTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                    />
                  </div>
                </div>

                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg">
                  {filteredRedemptionClients.length > 0 ? (
                    filteredRedemptionClients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => {
                          setRedemptionForm(prev => ({ ...prev, clientId: client.id }));
                          setSelectedRedemptionClient(client);
                        }}
                        className={`p-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                          redemptionForm.clientId === client.id ? 'bg-[#37b7ff]/10 border-[#37b7ff]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{client.name}</div>
                            <div className="text-xs text-gray-500">{client.email}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-[#37b7ff]">
                              {client.points || 0} pts
                            </div>
                            {redemptionForm.clientId === client.id && (
                              <div className="text-xs text-[#37b7ff]">✓ Seleccionado</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      No se encontraron clientes
                    </div>
                  )}
                </div>
              </div>

              {/* Selección de Recompensa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Recompensa *
                </label>
                
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                  {rewards.filter(r => r.active).map((reward) => {
                    const categoryInfo = getCategoryInfo(reward.category);
                    const canAfford = selectedRedemptionClient && (selectedRedemptionClient.points || 0) >= reward.points_required;
                    
                    return (
                      <div
                        key={reward.id}
                        onClick={() => {
                          if (canAfford) {
                            setRedemptionForm(prev => ({ ...prev, rewardId: reward.id }));
                            setSelectedRedemptionReward(reward);
                          }
                        }}
                        className={`p-3 border-b border-gray-100 last:border-b-0 ${
                          canAfford 
                            ? 'cursor-pointer hover:bg-gray-50' 
                            : 'opacity-50 cursor-not-allowed bg-gray-50'
                        } ${
                          redemptionForm.rewardId === reward.id ? 'bg-[#37b7ff]/10 border-[#37b7ff]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">{reward.name}</div>
                            {reward.description && (
                              <div className="text-xs text-gray-500 mt-1">{reward.description}</div>
                            )}
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${categoryInfo.color}`}>
                                {categoryInfo.label}
                              </span>
                              {!canAfford && selectedRedemptionClient && (
                                <span className="text-xs text-red-600">Puntos insuficientes</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-sm font-bold text-[#37b7ff]">
                              {reward.points_required} pts
                            </div>
                            {redemptionForm.rewardId === reward.id && (
                              <div className="text-xs text-[#37b7ff]">✓ Seleccionada</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Descripción adicional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas del canje (opcional)
                </label>
                <textarea
                  value={redemptionForm.description}
                  onChange={(e) => setRedemptionForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                  placeholder="Notas adicionales sobre el canje..."
                />
              </div>

              {/* Resumen del canje */}
              {selectedRedemptionClient && selectedRedemptionReward && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Gift className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-blue-800 text-sm">Resumen del canje</p>
                      <p className="text-blue-700 text-xs mt-1">
                        <span className="font-bold">{selectedRedemptionClient.name}</span> canjeará{' '}
                        <span className="font-bold">{selectedRedemptionReward.points_required} puntos</span> por:{' '}
                        <span className="font-bold">{selectedRedemptionReward.name}</span>
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-blue-600">
                          Puntos actuales: {selectedRedemptionClient.points || 0}
                        </span>
                        <span className="text-blue-600">
                          Puntos después: {(selectedRedemptionClient.points || 0) - selectedRedemptionReward.points_required}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelRedemption}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRedemptionSubmit}
                  disabled={!redemptionForm.clientId || !redemptionForm.rewardId}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
                >
                  <Gift size={16} />
                  <span>Procesar Canje</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Form Modal */}
      {showRewardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedReward ? 'Editar Recompensa' : 'Nueva Recompensa'}
              </h2>
              <button
                onClick={() => {
                  setShowRewardForm(false);
                  setSelectedReward(null);
                  setRewardForm({
                    name: '',
                    description: '',
                    points_required: 0,
                    category: 'descuentos',
                    active: true
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitReward} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la recompensa *
                  </label>
                  <input
                    type="text"
                    required
                    value={rewardForm.name}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                    placeholder="Ej: 20% descuento en nueva zona"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Puntos requeridos *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={rewardForm.points_required}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, points_required: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                  placeholder="Descripción detallada de la recompensa..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={rewardForm.category}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={rewardForm.active.toString()}
                    onChange={(e) => setRewardForm(prev => ({ ...prev, active: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37b7ff] focus:border-[#37b7ff]"
                  >
                    <option value="true">Activa</option>
                    <option value="false">Inactiva</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowRewardForm(false);
                    setSelectedReward(null);
                    setRewardForm({
                      name: '',
                      description: '',
                      points_required: 0,
                      category: 'descuentos',
                      active: true
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#37b7ff] text-white rounded-lg hover:bg-[#2da7ef] transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>{selectedReward ? 'Actualizar' : 'Crear'} Recompensa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsSection;