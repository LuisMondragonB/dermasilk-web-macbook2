# 🏗️ Estructura del Proyecto Dermasilk Web

## 📋 Resumen
Este documento detalla la arquitectura, estructura de carpetas, componentes y organización del código del sitio web de Dermasilk.

---

## 📁 Estructura de Carpetas

```
dermasilk-web/
├── 📁 public/
│   ├── 🖼️ images/
│   │   ├── hero-bg.jpg
│   │   ├── logo.png
│   │   └── testimonials/
│   ├── 📄 favicon.ico
│   └── 📄 manifest.json
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 Admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ClientManagement.tsx
│   │   │   ├── MembershipCalculator.tsx
│   │   │   └── RewardsSystem.tsx
│   │   ├── 📁 Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── 📁 Sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Memberships.tsx
│   │   └── 📁 UI/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Calculator.tsx
│   ├── 📁 pages/
│   │   ├── HomePage.tsx
│   │   ├── MembershipsPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── _app.tsx
│   ├── 📁 lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── 📁 types/
│   │   ├── index.ts
│   │   ├── admin.ts
│   │   └── memberships.ts
│   ├── 📁 styles/
│   │   ├── globals.css
│   │   └── animations.css
│   └── 📁 hooks/
│       ├── useAuth.ts
│       ├── useSupabase.ts
│       └── useAnimations.ts
├── 📄 package.json
├── 📄 tailwind.config.js
├── 📄 next.config.js
├── 📄 tsconfig.json
├── 📄 README.md
├── 📄 MEMBRESIAS.md
├── 📄 ANIMACIONES.md
└── 📄 ESTRUCTURA.md
```

---

## 🧩 Componentes Principales

### 🏠 Layout Components

#### Header.tsx
```typescript
interface HeaderProps {
  isScrolled: boolean;
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ isScrolled, activeSection }) => {
  // Navegación principal con efectos de scroll
  // Logo animado
  // Menú responsive
};
```

**Características**:
- Navegación sticky con efectos de transparencia
- Logo con animación de aparición
- Menú hamburguesa para móvil
- Indicador de sección activa

#### Footer.tsx
```typescript
const Footer: React.FC = () => {
  // Información de contacto
  // Redes sociales
  // Horarios de atención
  // Mapa de ubicación
};
```

### 🎭 Section Components

#### Hero.tsx (Página Principal)
```typescript
interface HeroProps {
  onNavigateToMemberships: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToMemberships }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Gradiente de fondo armonizado
  // Elementos flotantes animados
  // CTA principal
  // Animación hero-fade-in
};
```

**Elementos Clave**:
- **Gradiente**: `bg-gradient-to-br from-[#e3f4ff] via-white to-[#f5f5f7]`
- **Animación**: `hero-fade-in` con duración de 1.2s
- **Elementos flotantes**: 5 círculos con animaciones `float` y `float-delayed`
- **CTA**: Botón principal que navega a membresías

#### Services.tsx
```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

const Services: React.FC = () => {
  // Grid de servicios
  // Cards con hover effects
  // Iconografía consistente
};
```

### 🏥 Admin Components

#### AdminDashboard.tsx
```typescript
interface AdminDashboardProps {
  user: User | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  // Panel de control principal
  // Métricas en tiempo real
  // Navegación entre secciones
  // Autenticación con Supabase
};
```

#### ClientManagement.tsx
```typescript
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership_type: string;
  sessions_remaining: number;
  points: number;
  created_at: string;
}

const ClientManagement: React.FC = () => {
  // CRUD completo de clientes
  // Tabla con filtros y búsqueda
  // Modales para edición
  // Validaciones de seguridad
};
```

#### MembershipCalculator.tsx (Admin)
```typescript
interface CalculatorProps {
  onAreaCreated: (area: Area) => void;
}

const MembershipCalculator: React.FC<CalculatorProps> = ({ onAreaCreated }) => {
  // Calculadora administrativa
  // Creación de nuevas áreas
  // Validación de duplicados
  // Integración con base de datos
};
```

### 💳 Membership Components

#### MembershipsPage.tsx
```typescript
const MembershipsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('medianas');
  const [selectedPlan, setSelectedPlan] = useState('completa');
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Hero con fondo armonizado
  // Selector de categorías
  // Calculadora de precios
  // Paquetes combinados
  // Sistema de recompensas
};
```

**Características Especiales**:
- **Fondo armonizado**: Mismo gradiente que página principal
- **Calculadora dual**: Una para usuarios, otra para admin
- **Áreas actualizadas**: 'Intergluteo' en lugar de 'Líneas'
- **WhatsApp integration**: Mensajes contextuales

---

## 🔧 Configuración Técnica

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#37b7ff',
        'primary-hover': '#2da7ef',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float-delayed 4s ease-in-out infinite 1s',
        'hero-fade-in': 'heroFadeIn 1.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        heroFadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
```

### Supabase Configuration
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos de base de datos
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: Client;
        Insert: Omit<Client, 'id' | 'created_at'>;
        Update: Partial<Omit<Client, 'id'>>;
      };
      areas: {
        Row: Area;
        Insert: Omit<Area, 'id' | 'created_at'>;
        Update: Partial<Omit<Area, 'id'>>;
      };
    };
  };
}
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
:root {
  /* Colores principales */
  --primary: #37b7ff;
  --primary-hover: #2da7ef;
  --secondary: #f8fafc;
  
  /* Gradientes */
  --hero-gradient: linear-gradient(135deg, #e3f4ff 0%, #ffffff 50%, #f5f5f7 100%);
  
  /* Elementos flotantes */
  --float-blue: rgba(59, 130, 246, 0.3);
  --float-pink: rgba(236, 72, 153, 0.4);
  --float-green: rgba(34, 197, 94, 0.3);
  --float-purple: rgba(168, 85, 247, 0.25);
  --float-yellow: rgba(251, 191, 36, 0.35);
}
```

### Tipografía
```css
/* Jerarquía tipográfica */
.text-hero { @apply text-4xl md:text-6xl font-bold; }
.text-section { @apply text-2xl md:text-3xl font-semibold; }
.text-card { @apply text-lg md:text-xl font-medium; }
.text-body { @apply text-base leading-relaxed; }
.text-caption { @apply text-sm text-gray-600; }
```

### Espaciado
```css
/* Sistema de espaciado consistente */
.section-padding { @apply py-16 md:py-24; }
.container-padding { @apply px-4 md:px-6 lg:px-8; }
.card-padding { @apply p-6 md:p-8; }
.element-spacing { @apply space-y-4 md:space-y-6; }
```

---

## 🔐 Autenticación y Seguridad

### Row Level Security (RLS)
```sql
-- Políticas de seguridad en Supabase
CREATE POLICY "Users can only access their own data" ON clients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Only authenticated users can read areas" ON areas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify areas" ON areas
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Hooks de Autenticación
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return { user, loading };
};
```

---

## 📊 Gestión de Estado

### Estado Local con useState
```typescript
// Ejemplo en MembershipsPage
const [selectedCategory, setSelectedCategory] = useState<CategoryType>('medianas');
const [selectedPlan, setSelectedPlan] = useState<PlanType>('completa');
const [showCalculator, setShowCalculator] = useState(false);
const [isVisible, setIsVisible] = useState(false);
```

### Estado Global con Context (si necesario)
```typescript
// contexts/AppContext.tsx
interface AppContextType {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);
```

---

## 🚀 Performance y Optimización

### Lazy Loading
```typescript
// Componentes cargados dinámicamente
const AdminDashboard = lazy(() => import('../components/Admin/AdminDashboard'));
const MembershipCalculator = lazy(() => import('../components/UI/Calculator'));

// Uso con Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### Optimización de Imágenes
```typescript
// Next.js Image optimization
import Image from 'next/image';

<Image
  src="/images/hero-bg.jpg"
  alt="Dermasilk Hero"
  width={1920}
  height={1080}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>
```

---

## 🧪 Testing y Calidad

### Estructura de Tests
```
tests/
├── 📁 components/
│   ├── Header.test.tsx
│   ├── Hero.test.tsx
│   └── Calculator.test.tsx
├── 📁 pages/
│   ├── HomePage.test.tsx
│   └── MembershipsPage.test.tsx
├── 📁 utils/
│   └── helpers.test.ts
└── 📁 integration/
    ├── auth.test.ts
    └── database.test.ts
```

### Ejemplo de Test
```typescript
// components/Hero.test.tsx
import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

describe('Hero Component', () => {
  it('renders hero content correctly', () => {
    render(<Hero onNavigateToMemberships={jest.fn()} />);
    expect(screen.getByText('Depilación Láser Profesional')).toBeInTheDocument();
  });
  
  it('applies fade-in animation', () => {
    render(<Hero onNavigateToMemberships={jest.fn()} />);
    const heroElement = screen.getByTestId('hero-content');
    expect(heroElement).toHaveClass('hero-fade-in');
  });
});
```

---

## 📱 Responsividad

### Breakpoints
```css
/* Tailwind breakpoints utilizados */
sm: 640px   /* Móvil grande */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeño */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
```

### Patrones Responsive
```typescript
// Ejemplo de componente responsive
const ResponsiveGrid = () => (
  <div className="
    grid 
    grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3 
    gap-4 
    md:gap-6 
    lg:gap-8
  ">
    {/* Contenido */}
  </div>
);
```

---

## 🔄 Flujo de Datos

### Arquitectura de Datos
```
Usuario → Componente → Hook → Supabase → Base de Datos
                    ↓
                 Estado Local
                    ↓
                 Re-render
```

### Ejemplo de Flujo
```typescript
// 1. Usuario interactúa con componente
const handleCreateClient = async (clientData: ClientInput) => {
  // 2. Hook procesa la acción
  const { data, error } = await supabase
    .from('clients')
    .insert(clientData);
  
  // 3. Estado se actualiza
  if (data) {
    setClients(prev => [...prev, data[0]]);
  }
  
  // 4. UI se re-renderiza automáticamente
};
```

---

## 📋 Checklist de Desarrollo

### ✅ Funcionalidades Implementadas
- [x] Página principal con hero animado
- [x] Página de membresías con calculadora
- [x] Panel administrativo completo
- [x] Sistema de autenticación
- [x] Base de datos en tiempo real
- [x] Efectos de animación armonizados
- [x] Diseño responsive
- [x] Integración con WhatsApp
- [x] Sistema de recompensas
- [x] Gestión de clientes

### 🔄 Mejoras Futuras
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Chat en vivo
- [ ] Sistema de citas online
- [ ] Integración con pasarelas de pago
- [ ] Analytics avanzados
- [ ] A/B Testing
- [ ] Internacionalización (i18n)

---

## 🛠️ Comandos de Desarrollo

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
npm run type-check   # Verificación de tipos

# Testing
npm run test         # Tests unitarios
npm run test:watch   # Tests en modo watch
npm run test:coverage # Coverage de tests

# Análisis
npm run analyze      # Análisis del bundle
npm run lighthouse   # Audit de performance
```

---

*Documentación actualizada: Enero 2025*
*Versión: 2.0*
*Autor: Equipo Dermasilk Development*