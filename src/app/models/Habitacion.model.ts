export interface HabitacionRequest {
    numero: number,
    tipoHabitacion: string,
    precio: number,
    capacidad: number,
    estadoHabitacion: string
}

export interface HabitacionResponse {
        id: number,
		numero: number,
		tipoHabitacion: string,
		idTipoHabitacion: number,
		precio: number,
		capacidad: number,
		estadoHabitacion: string,
		idEstadoHabitacio: number
}