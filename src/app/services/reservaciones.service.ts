import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ReservacionRequest, ReservacionResponse } from '../models/Reservacion.model';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {

  private apiUrl: string = environment.apiUrl + 'reservaciones';

  constructor(private http: HttpClient) { }

  getreservacions(): Observable<ReservacionResponse[]> {
    return this.http.get<ReservacionResponse[]>(this.apiUrl).pipe(
      map(reservacions => reservacions.sort()),
      catchError(error => {
        console.error('Error al obtener los reservacions', error);
        return of([]);
      })
    );
  }

  postreservacion(reservacion: ReservacionRequest): Observable<ReservacionResponse> {
    return this.http.post<ReservacionResponse>(this.apiUrl, reservacion).pipe(
      catchError(error => {
        console.error('Error al registrar el reservacion', error);
        return throwError(() => error);
      })
    );
  }

  putreservacion(reservacion: ReservacionRequest, reservacionId: number): Observable<ReservacionResponse> {
    return this.http.put<ReservacionResponse>(`${this.apiUrl}/${reservacionId}`, reservacion).pipe(
      catchError(error => {
        console.error('Error al actualizar el reservacion', error);
        return throwError(() => error);
      })
    );
  }

  deletereservacion(reservacionId: number): Observable<ReservacionResponse> {
    return this.http.delete<ReservacionResponse>(`${this.apiUrl}/${reservacionId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el reservacion', error);
        return throwError(() => error);
      })
    );
  }
}
