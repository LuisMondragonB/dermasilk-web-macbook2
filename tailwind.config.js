/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  safelist: [
    // Gradients y colores usados dinámicamente
    // from-*/to-* para azul, morado y amarillo que aparecen en calculadoras y tarjetas
    'from-blue-500', 'to-blue-600',
    'from-purple-500', 'to-purple-600',
    'from-yellow-500', 'to-yellow-600',
    // Variantes bg-*/text-* que se aplican por categorías
    'bg-blue-100', 'text-blue-800',
    'bg-purple-100', 'text-purple-800',
    'bg-yellow-100', 'text-yellow-800',
  ],
  plugins: [],
};
