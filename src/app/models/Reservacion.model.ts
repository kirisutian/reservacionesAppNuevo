export interface ReservacionRequest {
    idHuesped: number,
    idHabitacion: number,
    fechaEntrada: Date,
    fechaSalida: Date
}

export interface ReservacionResponse {
    id: number,
    huesped: string,
    habitacion: string,
    fechaEntrada: Date,
    fechaSalida: Date,
    idEstadoReservacion: string
}

export interface FechasReservacionRequest {
    fechaEntrada: Date,
    fechaSalida: Date
}

