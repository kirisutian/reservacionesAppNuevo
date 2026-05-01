import { Component, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HabitacionRequest, HabitacionResponse } from '../../models/Habitacion.model';
import { HabitacionesService } from '../../services/habitaciones.service';

import { TipoHabitacion, DescripcionTipoHabitacion } from '../../constants/tipo-habitacion.enum';
import { EstadoHabitacion, DescripcionEstadoHabitacion } from '../../constants/estado-habitacion.enum';

declare var bootstrap: any;

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css',
  standalone: false
})
export class HabitacionesComponent {

  textoModal: string = 'Registrar Habitación';

  habitaciones: HabitacionResponse[] = [];

  habitacionForm: FormGroup;

  tipos: TipoHabitacion[] = Object.values(TipoHabitacion);
  estados: EstadoHabitacion[] = Object.values(EstadoHabitacion);

  isEditMode: boolean = false;
  selectedHabitacion: HabitacionResponse | null = null;

  @ViewChild('habitacionModalRef')
  habitacionModalEl!: ElementRef;

  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private habitacionesService: HabitacionesService
  ) {
    this.habitacionForm = this.fb.group({
      numero: [null, [Validators.required]],
      tipoHabitacion: [null, [Validators.required]],
      precio: [null, [Validators.required]],
      capacidad: [null, [Validators.required]],
      estadoHabitacion: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listarHabitaciones();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.habitacionModalEl.nativeElement, { keyboard: false });

    this.habitacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  listarHabitaciones(): void {
    this.habitacionesService.gethabitaciones().subscribe({
      next: resp => this.habitaciones = resp,
      error: err => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar las habitaciones', 'error');
      }
    });
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar Habitación';
    this.modalInstance.show();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedHabitacion = null;
    this.habitacionForm.reset();
  }

  editarHabitacion(h: HabitacionResponse): void {
    this.isEditMode = true;
    this.selectedHabitacion = h;

    this.textoModal = 'Editando Habitación: ' + h.numero;

    this.habitacionForm.patchValue({
      numero: h.numero,
      tipoHabitacion: h.tipoHabitacion,
      precio: h.precio,
      capacidad: h.capacidad,
      estadoHabitacion: h.estadoHabitacion
    });

    this.modalInstance.show();
  }

  transformarTipo(tipo: string): string {
    return DescripcionTipoHabitacion[tipo as TipoHabitacion] || 'Desconocido';
  }

  transformarEstado(estado: string): string {
    return DescripcionEstadoHabitacion[estado as EstadoHabitacion] || 'Desconocido';
  }

  onSubmit(): void {
    if (this.habitacionForm.invalid) return;

    const data: HabitacionRequest = this.habitacionForm.value;

    if (this.isEditMode && this.selectedHabitacion) {
      // UPDATE
      this.habitacionesService.puthabitacion(data, this.selectedHabitacion.id).subscribe({
        next: updated => {
          const i = this.habitaciones.findIndex(h => h.id === this.selectedHabitacion?.id);
          if (i !== -1) this.habitaciones[i] = updated;

          Swal.fire('Actualizado', 'Habitación actualizada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
      });

    } else {
      // CREATE
      this.habitacionesService.posthabitacion(data).subscribe({
        next: nueva => {
          this.habitaciones.push(nueva);
          Swal.fire('Registrado', 'Habitación registrada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo registrar', 'error');
        }
      });
    }
  }

  deleteHabitacion(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La habitación será eliminada',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(r => {
      if (r.isConfirmed) {
        this.habitacionesService.deletehabitacion(id).subscribe({
          next: () => {
            this.habitaciones = this.habitaciones.filter(h => h.id !== id);
            Swal.fire('Eliminado', 'Habitación eliminada', 'success');
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