import { useState, useEffect, useRef } from 'react';

// Definición de las técnicas
const techniques = {
  coherente: {
    id: 'coherente',
    name: '🌬️ Respiración Coherente',
    desc: 'Activa el nervio vago, baja el cortisol y sincroniza el ritmo cardíaco. Ideal para empezar la mañana.',
    steps: ['Inhala 5s', 'Exhala 5s', '5 repeticiones'],
    phases: [
      { name: 'Inhala', duration: 5, action: 'expand' },
      { name: 'Exhala', duration: 5, action: 'contract' }
    ],
    rounds: 5,
    messages: ['Cierra los ojos si puedes 🤍', 'Suelta los hombros', 'Solo respira...', 'Muy bien, sigue...', '¡Lo estás haciendo increíble!']
  },
  '478': {
    id: '478',
    name: '🌙 Respiración 4-7-8',
    desc: 'Para cuando la mente no para de noche o sientes ansiedad aguda. Activa el parasimpático.',
    steps: ['Inhala 4s', 'Retén 7s', 'Exhala 8s'],
    phases: [
      { name: 'Inhala', duration: 4, action: 'expand' },
      { name: 'Retén', duration: 7, action: 'hold' },
      { name: 'Exhala', duration: 8, action: 'contract' }
    ],
    rounds: 4,
    messages: ['Relaja la mandíbula 🤍', 'Deja ir la tensión', 'Suelta todo con la exhalación...', '¡Excelente! Sigue así.']
  },
  diafragmatica: {
    id: 'diafragmatica',
    name: '🧘 Respiración Diafragmática',
    desc: 'Mano en el abdomen. Solo debe moverse el abdomen. Calma profunda para el estrés crónico.',
    steps: ['Inhala 4s', 'Retén 2s', 'Exhala 6s'],
    phases: [
      { name: 'Inhala', duration: 4, action: 'expand' },
      { name: 'Retén', duration: 2, action: 'hold' },
      { name: 'Exhala', duration: 6, action: 'contract' }
    ],
    rounds: 5,
    messages: ['Mano en el abdomen 🤍', 'Solo se mueve el abdomen', 'Respira profundo y lento...', 'Tu cuerpo se está calmando...', '¡Lo estás haciendo muy bien!']
  }
};

export default function BreathingApp() {
  const [activeTechId, setActiveTechId] = useState<keyof typeof techniques>('coherente');
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeftInPhase, setTimeLeftInPhase] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [message, setMessage] = useState('Cuando estés lista, presiona iniciar 🤍');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tech = techniques[activeTechId];

  const resetBreath = () => {
    setIsRunning(false);
    setIsFinished(false);
    setCurrentPhaseIdx(0);
    setCurrentRound(0);
    setTimeLeftInPhase(null);
    setMessage('Cuando estés lista, presiona iniciar 🤍');
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countTimerRef.current) clearInterval(countTimerRef.current);
  };

  const handleTechChange = (id: keyof typeof techniques) => {
    resetBreath();
    setActiveTechId(id);
  };

  const toggleBreath = () => {
    if (isFinished) {
      resetBreath();
      return;
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (!isRunning || isFinished) return;

    if (currentRound >= tech.rounds) {
      setIsRunning(false);
      setIsFinished(true);
      setMessage('¡Lo lograste! Tu sistema nervioso te lo agradece 🌸');
      return;
    }

    const phase = tech.phases[currentPhaseIdx];
    setTimeLeftInPhase(phase.duration);
    setMessage(tech.messages[currentRound % tech.messages.length]);

    countTimerRef.current = setInterval(() => {
      setTimeLeftInPhase(prev => {
        if (prev === null || prev <= 1) {
          if (countTimerRef.current) clearInterval(countTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => {
      if (currentPhaseIdx + 1 >= tech.phases.length) {
        setCurrentPhaseIdx(0);
        setCurrentRound(r => r + 1);
      } else {
        setCurrentPhaseIdx(p => p + 1);
      }
    }, phase.duration * 1000);

    return () => {
      if (countTimerRef.current) clearInterval(countTimerRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, currentRound, currentPhaseIdx, activeTechId, isFinished, tech.rounds, tech.phases, tech.messages]);

  // Derived state for styles
  const activePhase = isRunning && !isFinished ? tech.phases[currentPhaseIdx] : null;
  let circleSize = '180px';
  let shadow = '0 0 40px rgba(201,137,124,0.15), inset 0 0 30px rgba(201,137,124,0.05)';
  let transitionDuration = '0.5s';

  if (activePhase) {
    transitionDuration = `${activePhase.duration}s`;
    if (activePhase.action === 'expand') {
      circleSize = '240px';
      shadow = '0 0 80px rgba(201,137,124,0.4), inset 0 0 50px rgba(201,137,124,0.15)';
    } else if (activePhase.action === 'contract') {
      circleSize = '140px';
      shadow = '0 0 20px rgba(201,137,124,0.1)';
    } else if (activePhase.action === 'hold') {
      circleSize = '240px';
      shadow = '0 0 60px rgba(201,137,124,0.3), inset 0 0 40px rgba(201,137,124,0.1)';
    }
  } else if (isFinished) {
    circleSize = '180px';
    shadow = '0 0 80px rgba(201,137,124,0.5)';
    transitionDuration = '1s';
  }

  // Progress Bar Calculation
  const totalDuration = tech.phases.reduce((s, p) => s + p.duration, 0);
  const totalSecs = totalDuration * tech.rounds;
  let doneSecs = tech.phases.slice(0, currentPhaseIdx).reduce((s, p) => s + p.duration, 0) + (currentRound * totalDuration);
  if (activePhase && timeLeftInPhase !== null) {
      doneSecs += (activePhase.duration - timeLeftInPhase);
  }
  const progressPct = isFinished ? 100 : Math.min(100, Math.max(0, (doneSecs / totalSecs) * 100));

  const getWhatsAppLink = () => {
    const msg = `Hola Eliana 🤍 Terminé mi ejercicio de respiración (${tech.name.split(' — ')[0]}) y me gustaría saber más sobre cómo podemos trabajar juntas.`;
    return `https://wa.me/573118909491?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#2d1f1f] bg-gradient-to-br from-[#2d1f1f] via-[#3a2525] to-[#2d1f1f] text-white flex flex-col items-center py-12 px-6 font-sans relative overflow-x-hidden">
      
      {/* HEADER */}
      <div className="text-center mb-10 w-full max-w-2xl relative z-10 pt-8">
        <span className="text-[0.65rem] tracking-[0.3em] uppercase text-rose-light mb-3 block opacity-80">Método NEURO™ · Psic. Eliana Martínez</span>
        <h1 className="font-heading text-4xl md:text-5xl font-normal text-rose-pale mb-2">Respiración Guiada</h1>
        <p className="text-sm font-light text-white/50 tracking-wide">Regula tu mente · Calma tu cuerpo</p>
      </div>

      {/* SELECTOR */}
      <div className="flex gap-3 mb-10 flex-wrap justify-center w-full max-w-2xl relative z-10">
        {(Object.keys(techniques) as Array<keyof typeof techniques>).map((key) => (
          <button
            key={key}
            onClick={() => handleTechChange(key)}
            className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full text-[0.75rem] md:text-[0.8rem] transition-all duration-300 border ${
              activeTechId === key 
                ? 'bg-gradient-to-r from-rose to-rose-light border-transparent text-white font-medium shadow-[0_4px_15px_rgba(201,137,124,0.3)]' 
                : 'bg-white/5 border-rose/30 text-white/70 hover:bg-rose/20'
            }`}
          >
            {techniques[key].name.split(' — ')[0]}
          </button>
        ))}
      </div>

      {/* INFO TECHNIQUE */}
      {!isRunning && !isFinished && (
        <div className="bg-white/5 border border-rose/20 rounded-3xl p-6 md:p-8 max-w-xl w-full mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 relative z-10">
          <h3 className="font-heading text-xl text-rose-pale mb-3">{tech.name}</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-5 font-light">{tech.desc}</p>
          <div className="flex gap-2 flex-wrap">
            {tech.steps.map((step, i) => (
              <span key={i} className="bg-rose/10 border border-rose/20 rounded-full px-3 py-1 text-[0.75rem] text-rose-pale">
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGE */}
      <div className="font-heading text-xl md:text-2xl text-white/60 italic text-center mb-8 min-h-[36px] transition-all duration-500 relative z-10">
        {message}
      </div>

      {/* CIRCLE */}
      <div className="flex flex-col items-center mb-10 relative z-10">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center mb-8">
          <div className="absolute w-full h-full rounded-full border border-rose/20 pointer-events-none"></div>
          <div className="absolute w-[240px] h-[240px] rounded-full border border-rose/10 pointer-events-none"></div>
          
          <div 
            className="rounded-full bg-gradient-to-br from-rose-pale/30 to-rose/10 border-2 border-rose/60 flex flex-col items-center justify-center relative backdrop-blur-sm"
            style={{
              width: circleSize,
              height: circleSize,
              boxShadow: shadow,
              transition: `all ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`
            }}
          >
            {isFinished ? (
              <div className="font-heading text-4xl text-rose-pale">🤍</div>
            ) : (
              <>
                <div className="font-heading text-2xl text-rose-pale italic mb-1">
                  {activePhase ? activePhase.name : 'Respira'}
                </div>
                <div className="font-heading text-5xl text-white leading-none">
                  {timeLeftInPhase !== null && timeLeftInPhase > 0 ? timeLeftInPhase : ''}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ROUNDS DOTS */}
        <div className="flex gap-2.5 mb-6">
          {Array.from({ length: tech.rounds }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                i < currentRound || isFinished
                  ? 'bg-rose border-rose' 
                  : 'border-rose/40 bg-transparent'
              }`}
            ></div>
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div className="w-[280px] h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-rose to-rose-light rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
        <div className="text-[0.7rem] tracking-widest text-white/40">
          {isFinished ? 'COMPLETADO' : `RONDA ${Math.min(currentRound + 1, tech.rounds)} / ${tech.rounds}`}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col items-center gap-4 w-full max-w-sm relative z-10 pb-12">
        {!isFinished && (
          <button 
            onClick={toggleBreath}
            className="w-full bg-gradient-to-r from-rose to-rose-light text-white py-4 rounded-full text-[0.85rem] tracking-[0.15em] uppercase font-medium transition-all hover:shadow-[0_10px_30px_rgba(201,137,124,0.3)] hover:-translate-y-0.5"
          >
            {isRunning ? 'Pausar' : currentRound > 0 ? 'Continuar' : 'Iniciar Sesión'}
          </button>
        )}
        
        {(isRunning || currentRound > 0) && !isFinished && (
          <button 
            onClick={resetBreath}
            className="text-[0.75rem] text-white/50 tracking-wider hover:text-white uppercase transition-colors"
          >
            Reiniciar
          </button>
        )}
      </div>

      {/* CTA AL FINALIZAR (EMBUDO) */}
      {isFinished && (
        <div className="mt-4 mb-16 w-full max-w-md bg-white/5 border border-rose/30 rounded-3xl p-8 text-center animate-in zoom-in-95 duration-700 relative z-10 backdrop-blur-md shadow-2xl">
          <h3 className="font-heading text-2xl text-rose-pale mb-4">¿Te sientes más en paz?</h3>
          <p className="text-[0.95rem] text-white/70 font-light leading-relaxed mb-8">
            Si lograste calmar tu mente hoy en unos minutos, imagina lo que podemos lograr juntas trabajando a profundidad tu salud emocional.
          </p>
          <a 
            href={getWhatsAppLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-rose text-white px-8 py-4.5 rounded-full text-[0.8rem] tracking-[0.1em] uppercase font-medium transition-all duration-300 hover:bg-[#a86e62] shadow-[0_10px_30px_rgba(201,137,124,0.4)] hover:-translate-y-1"
          >
            <span>Escríbeme por WhatsApp</span>
            <span className="text-lg">🤍</span>
          </a>
          <button 
            onClick={resetBreath}
            className="mt-8 text-[0.75rem] text-white/40 tracking-wider hover:text-white uppercase transition-colors block mx-auto border-b border-transparent hover:border-white/50 pb-0.5"
          >
            Hacer otro ejercicio
          </button>
        </div>
      )}

      {/* Volver al inicio */}
      <a href="/" className="fixed top-6 left-6 md:top-8 md:left-8 text-white/50 hover:text-white text-[0.75rem] md:text-[0.8rem] tracking-wider uppercase transition-colors flex items-center gap-2 z-50 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
        <span>←</span> Volver al inicio
      </a>

      {/* Ambient background glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-rose-pale/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-rose/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

    </div>
  );
}
