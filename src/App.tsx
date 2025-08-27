import HomePage from "./pages/HomePage";
import MembershipsPage from "./pages/MembershipsPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import Navigation from "./components/Layout/Navigation";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (!supabase) {
          setIsAuthenticated(false);
          return;
        }
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setIsAuthenticated(Boolean(data.session));

        // Suscribirse a cambios de sesión
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          setIsAuthenticated(Boolean(session));
        });

        return () => {
          listener.subscription.unsubscribe();
        };
      } catch {
        if (mounted) setIsAuthenticated(false);
      }
    };

    const cleanup = initAuth();
    return () => {
      mounted = false;
      // cleanup puede ser una promesa que resuelva a una función
      Promise.resolve(cleanup).then((fn: any) => {
        if (typeof fn === 'function') fn();
      });
    };
  }, []);

  // Mostrar loading mientras verifica autenticación
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#37b7ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Solo mostrar navegación en páginas públicas */}
      {location.pathname !== '/admin' && location.pathname !== '/login' && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/membresias" element={<MembershipsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? (
              <AdminPage />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;