export enum EstadoHabitacion {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADA = 'OCUPADA',
  LIMPIEZA = 'LIMPIEZA',
  MANTENIMIENTO = 'MANTENIMIENTO'
}

export const DescripcionEstadoHabitacion: Record<EstadoHabitacion, string> = {
  [EstadoHabitacion.DISPONIBLE]: 'Disponible',
  [EstadoHabitacion.OCUPADA]: 'Ocupada',
  [EstadoHabitacion.LIMPIEZA]: 'En limpieza',
  [EstadoHabitacion.MANTENIMIENTO]: 'En mantenimiento'
};