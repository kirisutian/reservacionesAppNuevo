import { Component, ElementRef, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HuespedRequest, HuespedResponse } from '../../models/Huesped.model';
import { HuespedesService } from '../../services/huespedes.service';

declare var bootstrap: any;

@Component({
  selector: 'app-huespedes',
  templateUrl: './huespedes.component.html',
  styleUrl: './huespedes.component.css',
  standalone: false
})
export class HuespedesComponent {

  textoModal: string = 'Registrar Huésped';

  huespedes: HuespedResponse[] = [];

  huespedForm: FormGroup;

  isEditMode: boolean = false;
  selectedHuesped: HuespedResponse | null = null;

  @ViewChild('huespedModalRef')
  huespedModalEl!: ElementRef;

  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private huespedesService: HuespedesService
  ) {
    this.huespedForm = this.fb.group({
      nombre: [null, [Validators.required]],
      apellidoPaterno: [null, [Validators.required]],
      apellidoMaterno: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      telefono: [null, [Validators.required]],
      documento: [null, [Validators.required]],
      tipoDocumento: [null, [Validators.required]],
      nacionalidad: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listarHuespedes();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.huespedModalEl.nativeElement, { keyboard: false });

    this.huespedModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  listarHuespedes(): void {
    this.huespedesService.gethuespeds().subscribe({
      next: resp => this.huespedes = resp,
      error: err => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los huéspedes', 'error');
      }
    });
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar Huésped';
    this.modalInstance.show();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedHuesped = null;
    this.huespedForm.reset();
  }

  editarHuesped(h: HuespedResponse): void {
    this.isEditMode = true;
    this.selectedHuesped = h;

    this.textoModal = 'Editando Huésped: ' + h.nombre;

    this.huespedForm.patchValue({
      nombre: h.nombre,
      apellidoPaterno: h.apellidoPaterno,
      apellidoMaterno: h.apellidoMaterno,
      email: h.email,
      telefono: h.telefono,
      documento: h.documento,
      tipoDocumento: h.tipoDocumento,
      nacionalidad: h.nacionalidad
    });

    this.modalInstance.show();
  }

  onSubmit(): void {
    if (this.huespedForm.invalid) return;

    const data: HuespedRequest = this.huespedForm.value;

    if (this.isEditMode && this.selectedHuesped) {
      // UPDATE
      this.huespedesService.puthuesped(data, this.selectedHuesped.id).subscribe({
        next: updated => {
          const i = this.huespedes.findIndex(h => h.id === this.selectedHuesped?.id);
          if (i !== -1) this.huespedes[i] = updated;

          Swal.fire('Actualizado', 'Huésped actualizado correctamente', 'success');
          this.modalInstance.hide();
        },
        error: err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
      });

    } else {
      // CREATE
      this.huespedesService.posthuesped(data).subscribe({
        next: nuevo => {
          this.huespedes.push(nuevo);
          Swal.fire('Registrado', 'Huésped registrado correctamente', 'success');
          this.modalInstance.hide();
        },
        error: err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo registrar', 'error');
        }
      });
    }
  }

  deleteHuesped(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El huésped será eliminado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(r => {
      if (r.isConfirmed) {
        this.huespedesService.deletehuesped(id).subscribe({
          next: () => {
            this.huespedes = this.huespedes.filter(h => h.id !== id);
            Swal.fire('Eliminado', 'Huésped eliminado', 'success');
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
