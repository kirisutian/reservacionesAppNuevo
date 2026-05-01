import { Component, ElementRef, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReservacionRequest, ReservacionResponse } from '../../models/Reservacion.model';
import { ReservacionesService } from '../../services/reservaciones.service';

declare var bootstrap: any;

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrl: './reservaciones.component.css',
  standalone: false
})
export class ReservacionesComponent {

  textoModal: string = 'Registrar Reservación';

  reservaciones: ReservacionResponse[] = [];

  reservacionForm: FormGroup;

  isEditMode: boolean = false;
  selectedReservacion: ReservacionResponse | null = null;

  @ViewChild('reservacionModalRef')
  reservacionModalEl!: ElementRef;

  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private reservacionesService: ReservacionesService
  ) {
    this.reservacionForm = this.fb.group({
      idHuesped: [null, [Validators.required]],
      idHabitacion: [null, [Validators.required]],
      fechaEntrada: [null, [Validators.required]],
      fechaSalida: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listarReservaciones();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.reservacionModalEl.nativeElement, { keyboard: false });

    this.reservacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  listarReservaciones(): void {
    this.reservacionesService.getreservacions().subscribe({
      next: resp => this.reservaciones = resp,
      error: err => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar las reservaciones', 'error');
      }
    });
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar Reservación';
    this.modalInstance.show();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedReservacion = null;
    this.reservacionForm.reset();
  }

  editarReservacion(r: ReservacionResponse): void {
    this.isEditMode = true;
    this.selectedReservacion = r;

    this.textoModal = 'Editando Reservación de: ' + r.huesped;

    this.reservacionForm.patchValue({
      idHuesped: null,      // si después quieres mapear IDs reales lo ajustamos
      idHabitacion: null,   // igual aquí
      fechaEntrada: r.fechaEntrada,
      fechaSalida: r.fechaSalida
    });

    this.modalInstance.show();
  }

  onSubmit(): void {
    if (this.reservacionForm.invalid) return;

    const data: ReservacionRequest = this.reservacionForm.value;

    if (this.isEditMode && this.selectedReservacion) {

      // UPDATE
      this.reservacionesService.putreservacion(data, this.selectedReservacion.id).subscribe({
        next: updated => {
          const i = this.reservaciones.findIndex(r => r.id === this.selectedReservacion?.id);
          if (i !== -1) this.reservaciones[i] = updated;

          Swal.fire('Actualizado', 'Reservación actualizada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
      });

    } else {

      // CREATE
      this.reservacionesService.postreservacion(data).subscribe({
        next: nuevo => {
          this.reservaciones.push(nuevo);
          Swal.fire('Registrado', 'Reservación registrada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo registrar', 'error');
        }
      });

    }
  }

  deleteReservacion(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La reservación será eliminada',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(r => {
      if (r.isConfirmed) {
        this.reservacionesService.deletereservacion(id).subscribe({
          next: () => {
            this.reservaciones = this.reservaciones.filter(r => r.id !== id);
            Swal.fire('Eliminado', 'Reservación eliminada', 'success');
          },
          error: err => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar', 'error');
          }
        });
      }
    });
  }

}