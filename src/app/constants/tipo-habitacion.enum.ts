export enum TipoHabitacion {
  INDIVIDUAL = 'INDIVIDUAL',
  SENCILLA = 'SENCILLA',
  DOBLE = 'DOBLE',
  TRIPLE = 'TRIPLE',
  QUEEN = 'QUEEN',
  SUITE = 'SUITE'
}

export const DescripcionTipoHabitacion: Record<TipoHabitacion, string> = {
  [TipoHabitacion.INDIVIDUAL]: 'Individual',
  [TipoHabitacion.SENCILLA]: 'Sencilla',
  [TipoHabitacion.DOBLE]: 'Doble',
  [TipoHabitacion.TRIPLE]: 'Triple',
  [TipoHabitacion.QUEEN]: 'Queen',
  [TipoHabitacion.SUITE]: 'Suite'
};