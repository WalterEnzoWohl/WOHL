import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Search } from 'lucide-react';
import { Header } from '../components/Header';
import { routines } from '../data/mockData';

const muscleOptions = ['Todos', 'Pecho', 'Espalda', 'Hombros', 'Tríceps', 'Bíceps', 'Piernas', 'Core', 'Full Body'];

const exerciseLibrary = [
  { name: 'Bench Press (Barra)', muscle: 'Pecho' },
  { name: 'Press Inclinado', muscle: 'Pecho' },
  { name: 'Aperturas Mancuernas', muscle: 'Pecho' },
  { name: 'Press Militar', muscle: 'Hombros' },
  { name: 'Elevaciones Laterales', muscle: 'Hombros' },
  { name: 'Dominadas', muscle: 'Espalda' },
  { name: 'Remo con Barra', muscle: 'Espalda' },
  { name: 'Jalón al Pecho', muscle: 'Espalda' },
  { name: 'Sentadilla', muscle: 'Piernas' },
  { name: 'Peso Muerto', muscle: 'Piernas' },
  { name: 'Prensa de Piernas', muscle: 'Piernas' },
  { name: 'Curl con Barra', muscle: 'Bíceps' },
  { name: 'Curl Martillo', muscle: 'Bíceps' },
  { name: 'Extensiones Tríceps', muscle: 'Tríceps' },
  { name: 'Rompe Cráneos', muscle: 'Tríceps' },
  { name: 'Plancha', muscle: 'Core' },
];

export default function RoutineEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const existing = !isNew ? routines.find((r) => r.id === Number(id)) : null;

  const [name, setName] = useState(existing?.name || '');
  const [daysPerWeek, setDaysPerWeek] = useState(existing?.daysPerWeek || 4);
  const [days, setDays] = useState(
    existing?.days.map((d) => ({
      name: d.name,
      exercises: d.exercises.map((ex) => ({
        name: ex.name,
        muscle: ex.muscle,
        sets: ex.sets.length,
        reps: ex.sets[0]?.reps || 10,
      })),
    })) || [{ name: 'Día 1', exercises: [] }]
  );
  const [expandedDay, setExpandedDay] = useState<number>(0);
  const [showExSearch, setShowExSearch] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Todos');

  const filteredExercises = exerciseLibrary.filter((ex) => {
    const matchMuscle = selectedMuscle === 'Todos' || ex.muscle === selectedMuscle;
    const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMuscle && matchSearch;
  });

  const addDay = () => {
    setDays((prev) => [...prev, { name: `Día ${prev.length + 1}`, exercises: [] }]);
  };

  const addExercise = (dayIdx: number, exName: string, muscle: string) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, exercises: [...d.exercises, { name: exName, muscle, sets: 3, reps: 10 }] }
          : d
      )
    );
    setShowExSearch(null);
    setSearchQuery('');
  };

  const removeExercise = (dayIdx: number, exIdx: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx ? { ...d, exercises: d.exercises.filter((_, ei) => ei !== exIdx) } : d
      )
    );
  };

  const updateExercise = (dayIdx: number, exIdx: number, field: 'sets' | 'reps', value: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              exercises: d.exercises.map((ex, ei) => (ei === exIdx ? { ...ex, [field]: value } : ex)),
            }
          : d
      )
    );
  };

  const handleSave = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header showBack title={isNew ? 'Crear Rutina' : 'Editar Rutina'} />

      <div className="flex flex-col gap-5 px-5 py-5 pb-6">
        {/* Name input */}
        <div>
          <label className="text-[#ADAAAA] text-xs uppercase tracking-widest font-semibold mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>
            Nombre de la Rutina
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. Upper / Lower Volumen..."
            className="w-full bg-[#131313] border border-[#262626] rounded-xl px-4 py-3 text-white text-base outline-none focus:border-[rgba(18,239,211,0.4)] transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
        </div>

        {/* Frequency selector */}
        <div>
          <label className="text-[#ADAAAA] text-xs uppercase tracking-widest font-semibold mb-3 block" style={{ fontFamily: "'Inter', sans-serif" }}>
            Días por semana
          </label>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                onClick={() => setDaysPerWeek(d)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  daysPerWeek === d
                    ? 'bg-[#12EFD3] text-black'
                    : 'bg-[#1C2030] text-[#ADAAAA] border border-[#262626]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Days / Exercises */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[#ADAAAA] text-xs uppercase tracking-widest font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
              Días de entrenamiento
            </label>
            <button
              onClick={addDay}
              className="flex items-center gap-1 text-[#12EFD3] text-xs font-semibold"
            >
              <Plus size={14} />
              Añadir día
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="bg-[#131313] rounded-2xl border border-[#262626] overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === dayIdx ? -1 : dayIdx)}
                  className="w-full flex items-center justify-between px-4 py-4"
                >
                  <div>
                    <input
                      type="text"
                      value={day.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDays((prev) =>
                          prev.map((d, i) => (i === dayIdx ? { ...d, name: val } : d))
                        );
                        e.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent text-white font-semibold text-base outline-none"
                    />
                    <p className="text-[#ADAAAA] text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {day.exercises.length} ejercicios
                    </p>
                  </div>
                  {expandedDay === dayIdx ? (
                    <ChevronUp size={16} className="text-[#ADAAAA]" />
                  ) : (
                    <ChevronDown size={16} className="text-[#ADAAAA]" />
                  )}
                </button>

                {expandedDay === dayIdx && (
                  <div className="border-t border-[#262626] px-4 pb-4">
                    {day.exercises.length === 0 ? (
                      <p className="text-[#ADAAAA] text-sm text-center py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        No hay ejercicios. Añade uno.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2 mt-3">
                        {day.exercises.map((ex, exIdx) => (
                          <div key={exIdx} className="flex items-center gap-3 bg-[#1C2030] rounded-xl px-3 py-3">
                            <div className="flex-1">
                              <p className="text-white text-sm font-semibold">{ex.name}</p>
                              <p className="text-[#ADAAAA] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{ex.muscle}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={ex.sets}
                                  onChange={(e) => updateExercise(dayIdx, exIdx, 'sets', Number(e.target.value))}
                                  className="w-8 bg-[#262626] text-white text-xs text-center rounded-lg py-1 outline-none"
                                />
                                <span className="text-[#ADAAAA] text-xs">×</span>
                                <input
                                  type="number"
                                  value={ex.reps}
                                  onChange={(e) => updateExercise(dayIdx, exIdx, 'reps', Number(e.target.value))}
                                  className="w-8 bg-[#262626] text-white text-xs text-center rounded-lg py-1 outline-none"
                                />
                              </div>
                              <button onClick={() => removeExercise(dayIdx, exIdx)}>
                                <Trash2 size={14} className="text-[#E53935]/60" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setShowExSearch(dayIdx)}
                      className="w-full mt-3 flex items-center justify-center gap-2 border border-dashed border-[rgba(18,239,211,0.3)] rounded-xl py-3 text-[#12EFD3] text-sm font-semibold"
                    >
                      <Plus size={14} />
                      Añadir Ejercicio
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full bg-[#12EFD3] rounded-2xl py-4 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(18,239,211,0.2)]"
        >
          <Save size={18} className="text-black" />
          <span className="text-black font-bold text-base">Guardar Rutina</span>
        </button>
      </div>

      {/* Exercise search bottom sheet */}
      {showExSearch !== null && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowExSearch(null)} />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl flex flex-col"
            style={{ background: '#1C2030', maxHeight: '80%' }}
          >
            <div className="w-10 h-1 bg-[#262626] rounded-full mx-auto mt-4 mb-3 flex-shrink-0" />
            <div className="px-5 pb-4 flex-shrink-0">
              <h3 className="text-white font-bold text-lg mb-3">Buscar Ejercicio</h3>
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADAAAA]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar ejercicio..."
                  className="w-full bg-[#262626] rounded-xl pl-9 pr-4 py-3 text-white text-sm outline-none border border-[#333]"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {muscleOptions.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMuscle(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                      selectedMuscle === m
                        ? 'bg-[#12EFD3] text-black'
                        : 'bg-[#262626] text-[#ADAAAA]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto px-5 pb-6">
              <div className="flex flex-col gap-2">
                {filteredExercises.map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => addExercise(showExSearch, ex.name, ex.muscle)}
                    className="flex items-center justify-between bg-[#262626] rounded-xl px-4 py-3 text-left hover:bg-[#333] transition-colors"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{ex.name}</p>
                      <p className="text-[#ADAAAA] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{ex.muscle}</p>
                    </div>
                    <Plus size={16} className="text-[#12EFD3] flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
