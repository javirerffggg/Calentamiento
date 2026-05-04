import { RoutineType, DayRoutine } from '../types';

export const ROUTINES: DayRoutine[] = [
  {
    id: RoutineType.PUSH,
    days: "Días 1 y 4",
    title: "Empuje (Pecho, Hombros y Tríceps)",
    sections: [
      {
        title: "1. Movilidad Articular",
        exercises: [
          { name: "Círculos de cuello y muñecas", duration: 30, notes: "Movimientos lentos y controlados." },
          { name: "Balanceos de brazos horizontales", reps: "15 reps", notes: "Cruza los brazos frente al pecho rítmicamente." },
          { name: "Círculos de hombros (Molinos)", reps: "10 adelante / 10 atrás", notes: "Brazos estirados, círculos grandes." },
          { name: "Rotaciones Externas 'en L'", reps: "15 reps", notes: "Codos pegados al torso a 90°, abre manos hacia afuera al máximo." }
        ]
      },
      {
        title: "2. Activación Escapular",
        exercises: [
          { name: "Plancha", duration: 45, notes: "Fija la posición escapular." }
        ],
        restBetweenSets: "30s"
      },
      {
        title: "3. Series de Aproximación",
        exercises: [
          { 
            name: "Serie 1: 30% del peso real", 
            reps: "15 reps", 
            tempo: "3:1:1:0",
            weightPercent: 30,
            notes: "Asiento a altura alineada con mitad del pecho.",
            instruction: "Configuración: Máquina de Press de Banca."
          },
          { 
            name: "Serie 2: 60% del peso real", 
            reps: "8 reps", 
            tempo: "3:1:1:0",
            weightPercent: 60,
            notes: "Descanso previo: 45s." 
          }
        ],
        restBetweenSets: "60s"
      }
    ]
  },
  {
    id: RoutineType.PULL,
    days: "Días 2 y 5",
    title: "Tirón (Espalda, Hombros post. y Bíceps)",
    sections: [
      {
        title: "1. Movilidad Articular",
        exercises: [
          { name: "Rotaciones de Tronco con Brazos Relajados", reps: "20 giros", notes: "Brazos golpean suavemente el cuerpo por la inercia." },
          { name: "Círculos Escapulares", reps: "12 círculos", notes: "Sube a orejas, atrás (juntando escápulas), baja y adelante." },
          { name: "Círculos de muñecas", duration: 30, notes: "Preparar el agarre." }
        ]
      },
      {
        title: "2. Activación Escapular",
        exercises: [
          { name: "Superman alterno + Puente de glúteo", reps: "15 reps", notes: "2 series. Fija pelvis para prevenir balanceo lumbar." }
        ],
        restBetweenSets: "45s"
      },
      {
        title: "3. Series de Aproximación",
        exercises: [
          { 
            name: "Serie 1: 30% del peso real", 
            reps: "15 reps", 
            tempo: "3:1:1:0",
            weightPercent: 30,
            notes: "En Dominadas o Jalón al Pecho." 
          },
          { 
            name: "Serie 2: 60% del peso real", 
            reps: "8 reps", 
            tempo: "3:1:1:0",
            weightPercent: 60,
            notes: "Descanso previo: 45s." 
          }
        ],
        restBetweenSets: "60s"
      }
    ]
  },
  {
    id: RoutineType.LEGS,
    days: "Días 3 y 6",
    title: "Pierna y Abdominales",
    initialActivity: {
      name: "Elevación de Temperatura",
      duration: "5-7 min",
      notes: "Bicicleta estática o Elíptica (ritmo suave)."
    },
    sections: [
      {
        title: "1. Movilidad Articular",
        exercises: [
          { name: "Balanceos de Pierna (Pared)", reps: "15 front / 15 lat", notes: "Por cada pierna." },
          { name: "Sentadilla lateral dinámica (Cossack)", reps: "10 reps", notes: "Talón en el suelo de la pierna estirada." },
          { name: "Plancha lateral", duration: 30, notes: "Por cada lado." }
        ]
      },
      {
        title: "2. Series de Aproximación",
        exercises: [
          { 
            name: "Serie 1: Máquina vacía", 
            reps: "15 reps", 
            tempo: "3:1:1:0",
            notes: "Pies parte media-alta a ancho de hombros.",
            instruction: "Configuración: Sentadilla Hack."
          },
          { 
            name: "Serie 2: 50% del peso real", 
            reps: "8 reps", 
            tempo: "3:1:1:0",
            weightPercent: 50,
            notes: "Descanso previo: 60s." 
          }
        ],
        restBetweenSets: "90s"
      }
    ]
  },
  {
    id: RoutineType.UPPER,
    days: "Días de Upper",
    title: "Torso (Combinado)",
    sections: [
      {
        title: "1. Movilidad Articular",
        exercises: [
          { name: "Círculos de cuello y muñecas", duration: 30, notes: "Movimientos lentos." },
          { name: "Círculos de hombros (Molinos)", reps: "10 adelante / 10 atrás", notes: "Lubricar la articulación." },
          { name: "Rotaciones de Tronco con Brazos Relajados", reps: "15-20 giros", notes: "Activar la columna torácica." },
          { name: "Rotaciones Externas 'en L'", reps: "12-15 reps", notes: "Proteger el manguito rotador." }
        ]
      },
      {
        title: "2. Activación Escapular",
        exercises: [
          { name: "Círculos Escapulares", reps: "10 reps", notes: "Lentas: arriba, atrás, abajo, adelante." },
          { name: "Plancha", duration: 45, notes: "Activar el core." }
        ],
        restBetweenSets: "45s"
      },
      {
        title: "3. Series de Aproximación",
        exercises: [
          { name: "Serie 1: 30% del peso real", reps: "15 reps", tempo: "3:1:1:0", weightPercent: 30, notes: "Primer multiarticular del día." },
          { name: "Serie 2: 60% del peso real", reps: "8 reps", tempo: "3:1:1:0", weightPercent: 60, notes: "Primer multiarticular del día." }
        ]
      }
    ]
  },
  {
    id: RoutineType.LOWER_ALT,
    days: "Días de Lower",
    title: "Pierna (Refuerzo Lumbar)",
    initialActivity: {
      name: "Elevación de Temperatura",
      duration: "5 min",
      notes: "Bicicleta o Elíptica (ritmo suave)."
    },
    sections: [
      {
        title: "1. Movilidad Articular",
        exercises: [
          { name: "Balanceos de Pierna", reps: "15 front / 15 lat", notes: "Por cada pierna." },
          { name: "Sentadilla Cossack", reps: "10 reps", notes: "Abrir cadera y estirar aductores." },
          { name: "Plancha Lateral", duration: 30, notes: "Por cada lado." }
        ]
      },
      {
        title: "2. Activación Lumbar/Glúteo",
        exercises: [
          { name: "Puente de glúteo + Superman alterno", reps: "15 reps", notes: "Fija pelvis y protege lumbar." }
        ],
        restBetweenSets: "30s"
      },
      {
        title: "3. Series de Aproximación",
        exercises: [
          { name: "Serie 1: Máquina vacía / 30%", reps: "15 reps", tempo: "3:1:1:0", weightPercent: 30, notes: "En tu ejercicio principal." },
          { name: "Serie 2: 50-60% del peso real", reps: "8 reps", tempo: "3:1:1:0", weightPercent: 55, notes: "En tu ejercicio principal." }
        ]
      }
    ]
  }
];
