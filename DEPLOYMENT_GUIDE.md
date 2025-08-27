# Guía de Configuración de Supabase en Netlify

## 🚨 Error: "ERROR DE CONEXIÓN" en Login

Este error indica que las variables de entorno de Supabase no están configuradas en Netlify.

## 🔧 Solución: Configurar Variables de Entorno

### 1. Acceder al Panel de Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Inicia sesión en tu cuenta
3. Selecciona el sitio **dermasilk.mx**

### 2. Configurar Variables de Entorno
1. Ve a **Site settings** (Configuración del sitio)
2. Haz clic en **Environment variables** (Variables de entorno)
3. Haz clic en **Add variable** (Agregar variable)

### 3. Agregar las Variables Requeridas

Agrega estas **2 variables** exactamente como se muestran:

#### Variable 1:
- **Key (Clave)**: `VITE_SUPABASE_URL`
- **Value (Valor)**: `https://zlrjpsrrggolxlwgtyou.supabase.co`

#### Variable 2:
- **Key (Clave)**: `VITE_SUPABASE_ANON_KEY`
- **Value (Valor)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpscmpwc3JyZ2dvbHhsd2d0eW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1Mjk4MzAsImV4cCI6MjA2ODEwNTgzMH0.ijDIFrn1Jr3jRAdXkfMmkE0ehEq2luFKqeGyvIUL7Dc`