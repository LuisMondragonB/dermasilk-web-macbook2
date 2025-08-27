import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Andrea',
      text: 'Estoy fascinada con los resultados, en mi primer sesión se me ha quitado más del 50% del vello 😍 Son profesionales en lo que hacen, muy atentas y el lugar está súper limpio 💯',
      rating: 5,
      source: 'Facebook Reviews',
      avatar: '👩‍🦰'
    },
    {
      id: 2,
      name: 'Frida',
      text: 'Recibí un muy buen trato de parte de todo el personal. Los precios están muy accesibles. Además, los resultados son notorios desde la primera sesión. Por mi experiencia puedo decir que es un lugar muy recomendable.',
      rating: 5,
      source: 'Facebook Reviews',
      avatar: '👩‍🦱'
    },
    {
      id: 3,
      name: 'María',
      text: 'Increíble servicio y atención personalizada. El personal es muy profesional y me explican todo el proceso. Los resultados superaron mis expectativas.',
      rating: 5,
      source: 'Cliente satisfecha',
      avatar: '👩‍💼'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-xl text-gray-600">
            Testimonios reales de personas que han transformado su piel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-[#37b7ff]/20">
                <Quote size={32} />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-current"
                    size={20}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#37b7ff]/10 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.source}</div>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="absolute top-6 right-16">
                <div className="w-6 h-6 bg-[#37b7ff] rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" className="text-white">
                    <path
                      fill="currentColor"
                      d="M5.5 10.5L2 7l1.5-1.5L5.5 7.5 10.5 2.5 12 4l-6.5 6.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-[#37b7ff] mb-2">1,000+</div>
              <p className="text-gray-600">Clientes satisfechos</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#37b7ff] mb-2">5.0</div>
              <p className="text-gray-600">Calificación promedio</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#37b7ff] mb-2">98%</div>
              <p className="text-gray-600">Recomiendan el servicio</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#37b7ff] mb-2">5</div>
              <p className="text-gray-600">Años de experiencia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;