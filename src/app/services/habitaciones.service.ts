import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { HabitacionRequest, HabitacionResponse } from '../models/Habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  private apiUrl: string = environment.apiUrl + 'habitaciones';

  constructor(private http: HttpClient) { }

  gethabitaciones(): Observable<HabitacionResponse[]> {
    return this.http.get<HabitacionResponse[]>(this.apiUrl).pipe(
      map(habitacions => habitacions.sort()),
      catchError(error => {
        console.error('Error al obtener los habitacions', error);
        return of([]);
      })
    );
  }

  posthabitacion(habitacion: HabitacionRequest): Observable<HabitacionResponse> {
    return this.http.post<HabitacionResponse>(this.apiUrl, habitacion).pipe(
      catchError(error => {
        console.error('Error al registrar el habitacion', error);
        return throwError(() => error);
      })
    );
  }

  puthabitacion(habitacion: HabitacionRequest, habitacionId: number): Observable<HabitacionResponse> {
    return this.http.put<HabitacionResponse>(`${this.apiUrl}/${habitacionId}`, habitacion).pipe(
      catchError(error => {
        console.error('Error al actualizar el habitacion', error);
        return throwError(() => error);
      })
    );
  }

  deletehabitacion(habitacionId: number): Observable<HabitacionResponse> {
    return this.http.delete<HabitacionResponse>(`${this.apiUrl}/${habitacionId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el habitacion', error);
        return throwError(() => error);
      })
    );
  }
}
