import { useState, useEffect } from 'react';

const frases = [
  {
    text: '"Ella ya está en ti. Solo necesita despertar."',
    author: '— Eliana Martínez · @psicoelia.co'
  },
  {
    text: '"No llegaste tarde a tu vida. Simplemente nadie te había enseñado a ponerte primero."',
    author: '— Eliana Martínez · @psicoelia.co'
  },
  {
    text: '"Sanar no es olvidar. Es aprender a cargar lo que viviste sin que te aplaste."',
    author: '— Eliana Martínez · @psicoelia.co'
  },
  {
    text: '"Tu cuerpo no te está fallando. Está cargando todo lo que no has podido soltar."',
    author: '— Eliana Martínez · @psicoelia.co'
  },
  {
    text: '"Femenina, poderosa y libre. Eso no es algo que construyes. Es algo que recuerdas."',
    author: '— Eliana Martínez · @psicoelia.co'
  }
];

export default function QuotesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frases.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden w-full max-w-4xl mx-auto" itemScope itemType="http://schema.org/Quotation">
      <div className="min-h-[200px] flex items-center justify-center relative">
        {frases.map((frase, index) => (
          <div 
            key={index}
            className={`absolute w-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 absolute top-1/2 -translate-y-1/2'
            }`}
          >
            <p className="font-heading text-3xl md:text-4xl lg:text-[2.8rem] font-normal italic text-brown-dark leading-[1.4] max-w-3xl mx-auto mb-6">
              <span itemProp="text">{frase.text}</span>
            </p>
            <span className="text-xs md:text-sm tracking-[0.15em] uppercase text-rose font-medium block" itemProp="author">
              {frase.author}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2.5 justify-center mt-10">
        {frases.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
              index === currentIndex ? 'bg-rose w-6' : 'bg-rose-light w-2 hover:bg-rose/70'
            }`}
            aria-label={`Ir a frase ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
