import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Verificar si hay un bloqueo activo
    const savedBlockEndTime = localStorage.getItem('loginBlockEndTime');
    const savedAttempts = localStorage.getItem('loginAttempts');
    
    if (savedBlockEndTime) {
      const endTime = parseInt(savedBlockEndTime);
      const now = Date.now();
      
      if (now < endTime) {
        setIsBlocked(true);
        setBlockEndTime(endTime);
        setRemainingTime(Math.ceil((endTime - now) / 1000));
      } else {
        // El bloqueo ha expirado, limpiar datos
        localStorage.removeItem('loginBlockEndTime');
        localStorage.removeItem('loginAttempts');
      }
    }
    
    if (savedAttempts) {
      setLoginAttempts(parseInt(savedAttempts));
    }
  }, []);

  // Timer para actualizar el tiempo restante del bloqueo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBlocked && blockEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((blockEndTime - now) / 1000);
        
        if (remaining <= 0) {
          // El bloqueo ha terminado
          setIsBlocked(false);
          setBlockEndTime(null);
          setLoginAttempts(0);
          setRemainingTime(0);
          localStorage.removeItem('loginBlockEndTime');
          localStorage.removeItem('loginAttempts');
          setError('');
        } else {
          setRemainingTime(remaining);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlocked, blockEndTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si está bloqueado
    if (isBlocked) {
      setError(`Acceso bloqueado. Intenta nuevamente en ${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`);
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
      }
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        // Incrementar intentos fallidos
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());
        
        if (newAttempts >= 3) {
          // Bloquear por 1 hora (3600000 ms)
          const blockEnd = Date.now() + (60 * 60 * 1000);
          setIsBlocked(true);
          setBlockEndTime(blockEnd);
          setRemainingTime(60 * 60);
          localStorage.setItem('loginBlockEndTime', blockEnd.toString());
          
          setError('Demasiados intentos fallidos. Acceso bloqueado por 1 hora.');
        } else {
          const remainingAttempts = 3 - newAttempts;
          setError(`Credenciales incorrectas. Te quedan ${remainingAttempts} intento${remainingAttempts !== 1 ? 's' : ''}.`);
        }
      } else if (data.user && data.session) {
        // Login exitoso - resetear intentos
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('loginBlockEndTime');
        // Ya no se usa localStorage para auth. App.tsx escucha cambios de sesión.
        navigate('/admin');
      } else {
        setError('No se pudo autenticar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
    
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#37b7ff] rounded-full mb-6 shadow-lg">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Panel de Administración
          </h1>
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">Derma</span>
            <span className="text-3xl font-bold text-[#37b7ff]">silk</span>
            <span className="text-xs font-normal text-gray-500 ml-1">®</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/50">
          {/* Security Status */}
          {(isBlocked || loginAttempts > 0) && (
            <div className={`mb-6 p-4 rounded-xl border ${
              isBlocked 
                ? 'bg-red-50 border-red-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  isBlocked ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {isBlocked ? (
                    <Lock className="text-red-600" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-600" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  {isBlocked ? (
                    <div>
                      <p className="text-red-800 font-medium">Acceso bloqueado</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="text-red-600" size={16} />
                        <p className="text-red-600 text-sm">
                          Tiempo restante: {formatTime(remainingTime)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-yellow-800 font-medium">Advertencia de seguridad</p>
                      <p className="text-yellow-700 text-sm">
                        Intentos fallidos: {loginAttempts}/3
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress bar for attempts */}
              {!isBlocked && loginAttempts > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-yellow-700 mb-1">
                    <span>Intentos utilizados</span>
                    <span>{loginAttempts}/3</span>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(loginAttempts / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isBlocked}
                  className="w-full pl-10 pr-4 py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Ingresa tu email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  disabled={isBlocked}
                  className="w-full pl-10 pr-12 py-4 bg-white/60 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#37b7ff] focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`border rounded-xl p-3 ${
                error.includes('bloqueado') 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm text-center ${
                  error.includes('bloqueado') 
                    ? 'text-red-700 font-medium' 
                    : 'text-red-600'
                }`}>
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || isBlocked}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isBlocked
                  ? 'bg-gray-400 text-gray-200'
                  : 'bg-[#37b7ff] text-white hover:bg-[#2da7ef] transform hover:scale-105 hover:shadow-xl'
              }`}
            >
              {isBlocked ? (
                <div className="flex items-center justify-center space-x-2">
                  <Lock size={20} />
                  <span>Acceso Bloqueado</span>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Autenticando...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
            
            {/* Security Info */}
            {!isBlocked && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Por seguridad, el acceso se bloquea por 1 hora después de 3 intentos fallidos
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            disabled={isBlocked}
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm hover:underline"
          >
            ← Volver al sitio principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;