export interface HuespedRequest {
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    email: string,
    telefono: string,
    documento: string,
    tipoDocumento: string,
    nacionalidad: string
}


export interface HuespedResponse {
        id: number,
		nombre: string,
		apellidoPaterno: string,
		apellidoMaterno: string,
		email: string,
		telefono: string,
		documento: string,
		tipoDocumento: string,
		idTipoDocumento: number,
		nacionalidad: string
}