import { Component } from '@angular/core';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tareaEditando = {} as Tarea;

  arrayColeccionTareas: any = [
    {
      id: '',
      tarea: {} as Tarea,
    },
  ];

  idTareaSelec: string = '';

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.obtenerListaTareas();
  }

  obtenerListaTareas() {
    this.firestoreService.consultar('tareas').subscribe((datosRecibidos) => {
      // Limpiar el array para que no se dupliquen los datos anteriores
      this.arrayColeccionTareas = [];
      datosRecibidos.forEach((datosTarea) => {
        this.arrayColeccionTareas.push({
          id: datosTarea.payload.doc.id,
          tarea: datosTarea.payload.doc.data(),
        });
      });
    });
  }

  selecTarea(idTarea: string, tareaSelec: Tarea) {
    this.tareaEditando = tareaSelec;
    this.idTareaSelec = idTarea;
    this.router.navigate(['detalle', this.idTareaSelec]);
  }
}
