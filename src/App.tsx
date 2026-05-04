import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Dumbbell, 
  Timer as TimerIcon, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Info,
  Wind,
  Layers,
  Zap,
  Coffee,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROUTINES } from './constants/workouts';
import { RoutineType, DayRoutine } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom Hook for LocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

const Timer = ({ duration, label, onComplete, autoStart = false }: { duration: number, label?: string, onComplete?: () => void, autoStart?: boolean }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (onComplete) onComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, onComplete]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  return (
    <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
      {label && <span className="text-[10px] uppercase font-bold text-white/40 border-r border-white/10 pr-2">{label}</span>}
      <span className="font-mono text-xl tabular-nums text-accent leading-none">
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </span>
      <div className="flex items-center gap-2 border-l border-white/20 pl-2">
        <button onClick={toggle} className="p-1 hover:text-accent transition-colors">
          {isRunning ? <Wind className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={reset} className="p-1 hover:text-accent transition-colors">
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

const RestOverlay = ({ duration, onFinish }: { duration: number, onFinish: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414]/95 backdrop-blur-xl p-6"
    >
      <div className="text-center space-y-8 max-w-sm w-full">
        <div className="inline-flex p-6 rounded-full bg-accent/10 text-accent border-4 border-accent/20 animate-pulse">
          <Coffee className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight italic">DESCANSO ACTIVO</h2>
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Prepárate para la siguiente serie</p>
        </div>
        <div className="flex justify-center">
          <Timer duration={duration} autoStart={true} onComplete={onFinish} />
        </div>
        <button 
          onClick={onFinish}
          className="text-white/20 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold flex items-center gap-2 mx-auto"
        >
          Saltar descanso <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeRoutineId, setActiveRoutineId] = useLocalStorage<RoutineType>('warmup_active_routine', RoutineType.PUSH);
  const [workingWeight, setWorkingWeight] = useLocalStorage<number>('warmup_working_weight', 60);
  const [completedExercises, setCompletedExercises] = useLocalStorage<string[]>('warmup_completed_exercises', []);
  const [showRest, setShowRest] = useState<number | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeRoutine = useMemo(() => 
    ROUTINES.find(r => r.id === activeRoutineId) || ROUTINES[0]
  , [activeRoutineId]);

  const toggleComplete = (exerciseName: string, restAfter?: string) => {
    setActiveRoutineId(activeRoutine.id); // Refresh
    const isCompleted = completedExercises.includes(exerciseName);
    if (isCompleted) {
      setCompletedExercises(completedExercises.filter(e => e !== exerciseName));
    } else {
      setCompletedExercises([...completedExercises, exerciseName]);
      if (restAfter) {
        const seconds = parseInt(restAfter);
        if (!isNaN(seconds)) {
          setShowRest(seconds);
        }
      }
    }
  };

  const resetRoutine = () => {
    if (confirm('¿Resetear progreso de hoy?')) {
      setCompletedExercises([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#E4E3E0] font-sans selection:bg-accent selection:text-black pb-24">
      <AnimatePresence>
        {showRest && (
          <RestOverlay duration={showRest} onFinish={() => setShowRest(null)} />
        )}
      </AnimatePresence>

      <motion.header 
        initial={{ y: 0 }}
        animate={{ y: headerVisible ? 0 : -150 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="border-b border-white/10 fixed top-0 w-full bg-[#141414]/90 backdrop-blur-xl z-40"
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg text-accent">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">WARMUP</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
                {ROUTINES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRoutineId(r.id);
                      setCompletedExercises([]);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                      activeRoutineId === r.id 
                        ? "bg-accent text-black" 
                        : "text-white/40 hover:text-white"
                    )}
                  >
                    {r.id === RoutineType.PUSH ? 'Push' : r.id === RoutineType.PULL ? 'Pull' : 'Legs'}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <input 
                  type="number" 
                  value={workingWeight}
                  onChange={(e) => setWorkingWeight(Number(e.target.value))}
                  className="bg-transparent border-none text-accent font-mono font-bold text-sm w-10 focus:ring-0 text-right p-0"
                />
                <span className="text-white/30 font-mono text-[10px] uppercase">kg</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoutine.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-8 flex justify-between items-end">
              <div className="border-l-2 border-accent pl-4">
                <span className="text-accent/60 font-mono text-[10px] tracking-[0.2em] uppercase">{activeRoutine.days}</span>
                <h2 className="text-2x font-black italic tracking-tight">{activeRoutine.title}</h2>
              </div>
              <button 
                onClick={resetRoutine}
                className="p-2 text-white/20 hover:text-accent transition-colors"
                title="Resetear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {activeRoutine.initialActivity && (
              <div className="mb-8">
                <div className="flex items-center gap-4 bg-accent text-black p-4 rounded-2xl shadow-lg shadow-accent/5">
                  <div className="bg-black/10 p-2 rounded-xl">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-sm uppercase font-mono tracking-tighter">{activeRoutine.initialActivity.name}</h3>
                      <span className="text-[10px] font-bold font-mono opacity-60">{activeRoutine.initialActivity.duration}</span>
                    </div>
                    <p className="text-[11px] font-medium leading-tight opacity-70">{activeRoutine.initialActivity.notes}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-10">
              {activeRoutine.sections.map((section, idx) => (
                <section key={idx}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-[9px] uppercase tracking-[0.3em] font-black text-white/20 whitespace-nowrap">
                      {section.title}
                    </h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="grid gap-2">
                    {section.exercises.map((ex, exIdx) => {
                      const isDone = completedExercises.includes(ex.name);
                      const calculatedWeight = ex.weightPercent ? Math.round(workingWeight * (ex.weightPercent / 100)) : null;

                      return (
                        <div 
                          key={exIdx}
                          className={cn(
                            "relative overflow-hidden bg-[#1E1E1E] border border-white/5 rounded-xl p-4 transition-all duration-300",
                            isDone ? "opacity-25 grayscale scale-[0.98]" : "hover:border-accent/20 hover:bg-[#252525]"
                          )}
                        >
                          <div className="flex gap-4">
                            <button 
                              onClick={() => toggleComplete(ex.name, section.restBetweenSets)}
                              className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                                isDone 
                                  ? "bg-accent border-accent text-black" 
                                  : "border-white/10 text-transparent hover:border-accent/40"
                              )}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>

                            <div className="flex-1 min-w-0 space-y-1">
                              <h4 className="text-sm font-black tracking-tight uppercase italic leading-tight">
                                {ex.name}
                              </h4>
                              
                              <p className="text-[10px] text-white/40 leading-relaxed">
                                {ex.notes}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {ex.reps && (
                                  <span className="font-mono font-bold text-xs text-accent">
                                    {ex.reps}
                                  </span>
                                )}
                                {calculatedWeight !== null && (
                                  <span className="text-accent font-mono text-xs font-bold">
                                    ({calculatedWeight}kg)
                                  </span>
                                )}
                                {ex.tempo && (
                                  <span className="text-[8px] font-mono font-bold bg-white/5 text-white/30 px-1.5 py-0.5 rounded border border-white/5">
                                    {ex.tempo}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex-shrink-0 self-center">
                              {ex.duration && (
                                <Timer duration={ex.duration} onComplete={() => {}} />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <section className="mt-32 border-t-2 border-white/5 grid md:grid-cols-2 gap-16 pt-16">
          <div className="space-y-8">
            <h4 className="flex items-center gap-3 font-black uppercase tracking-[0.3em] text-accent text-xs italic">
              <Layers className="w-5 h-5" /> Protocolo de Trabajo
            </h4>
            <div className="space-y-4">
              {[
                { title: "Adaptación Mecánica", desc: "Lubrica articulaciones y calibra la técnica sin generar fatiga central." },
                { title: "RIR 10 (Esfuerzo 0)", desc: "Todas las aproximaciones deben sentirse como aire. No busques fatiga." },
                { title: "Transición Explosiva", desc: "Descansa 120s tras la última serie de aproximación antes del peso real." }
              ].map((p, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                  <ChevronRight className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold whitespace-nowrap">{p.title}</h5>
                    <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
             <h4 className="flex items-center gap-3 font-black uppercase tracking-[0.3em] text-accent text-xs italic">
              <TimerIcon className="w-5 h-5" /> Lectura de Tempo
            </h4>
            <div className="bg-black/50 overflow-hidden rounded-[2rem] border border-white/5 font-mono text-sm">
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-center group">
                    <span className="text-white/20 group-hover:text-accent transition-colors">FASE EXCÉNTRICA</span>
                    <span className="text-accent font-bold">3s Descendiendo</span>
                  </div>
                   <div className="flex justify-between items-center group">
                    <span className="text-white/20 group-hover:text-accent transition-colors">MÁXIMO ESTIRAMIENTO</span>
                    <span className="text-accent font-bold">1s Pausa Isométrica</span>
                  </div>
                   <div className="flex justify-between items-center group">
                    <span className="text-white/20 group-hover:text-accent transition-colors">FASE CONCÉNTRICA</span>
                    <span className="text-accent font-bold">1s Explosivo</span>
                  </div>
                   <div className="flex justify-between items-center group">
                    <span className="text-white/20 group-hover:text-accent transition-colors">BLOQUEO</span>
                    <span className="text-accent font-bold">0s Sin Pausa</span>
                  </div>
                </div>
                <div className="bg-accent text-black p-4 text-[10px] text-center font-black uppercase tracking-widest">
                  Aplicar estrictamente en series de aproximación
                </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
