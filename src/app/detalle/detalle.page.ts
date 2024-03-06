import { Component, OnInit } from '@angular/core';
import { Tarea } from '../tarea';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';

import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = '';
  imagenSelec: string = '';

  document: any = {
    id: '',
    data: {} as Tarea,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
  ) {}

  ngOnInit() {
    // Se almacena en una variable el id que se ha recibido desde la página anterior
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
    } else {
      this.id = '';
    }
    // Se hace la consulta a la base de datos para obtener los datos asociados a esa id
    this.firestoreService
      .consultarPorId('tareas', this.id)
      .subscribe((resultado: any) => {
        // Preguntar si se ha encontrado un document con ese ID
        if (resultado.payload.data() != null) {
          this.document.id = resultado.payload.id;
          this.document.data = resultado.payload.data();
          // Como ejemplo, mostrar el título de la tarea en consola
          console.log(this.document.data.titulo);
        } else {
          // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
          this.document.data = {} as Tarea;
        }
      });
  }

  clickBotonBorrar() {
    console.log('clickBotonBorrar');
    this.firestoreService.borrar('tareas', this.document.id).then(
      () => {
        console.log('Tarea borrada correctamente');
        this.document.data = {} as Tarea;
        this.document.id = '';
      },
      (error) => {
        console.error(error);
      }
    );
  }

  clickBotonModificar() {
    this.firestoreService
      .modificar('tareas', this.document.id, this.document.data)
      .then(
        () => {
          console.log('Tarea modificada correctamente');
        },
        (error) => {
          console.error(error);
        }
      );
  }

  tareaEditando = {} as Tarea;

  clickBotonInsertar() {
    this.firestoreService.insertar('tareas', this.document.data).then(
      () => {
        console.log('Tarea creada correctamente');
        this.tareaEditando = {} as Tarea;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  clickBotonSeleccionarImagen() {
    this.seleccionarImagen();
  }

  clickBotonSubirImagen() {
    this.subirImagen();
  }

  // clickBotonEliminarImagen() {
  //   this.eliminarArchivo();
  // }

  async seleccionarImagen() {
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission;
        } else {
          // Abrir selector de imágenes {ImagePicker}
          this.imagePicker
            .getPictures({
              maximumImagesCount: 1, // Permitir sólo 1 imagen
              outputType: 1, // 1 = Base64
            })
            .then(
              (results) => {
                // En la variable results se tienen las imágenes seleccionadas
                if (results.length > 0) {
                  // Si el usuario ha elegido alguna imagen
                  // EN LA VARIABLE imagenSelec QUEDA ALMACENADA LA IMAGEN SELECCIONADA
                  this.imagenSelec = 'data:image/jpeg;base64,' + results[0];
                  console.log(
                    'Imagen que se ha seleccionado (en Base64): ' +
                      this.imagenSelec
                  );
                }
              },
              (err) => {
                console.log(err);
              }
            );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async subirImagen() {
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000,
    });

    // Carpeta del Storage donde se alamacenará la imagen
    let nombreCarpeta = 'imagenes';

    // Mostrar el mensaje de espera
    loading.present();
    // Asignar el nombre de la imagen en función de la hora actual para evitar duplicidades de nombre
    let nombreImagen = `${new Date().getTime()}`;
    // Llamar al método que sube la imagen al Storage
    this.firestoreService
      .subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          // En la variable downloadURL se obtiene la dirección URL de la imagen
          console.log('downloadURL: ' + downloadURL);
          // this.document.data.imagen = downloandURL;
          // Mostrar el mensaje de finalización de la subida
          toast.present();
          // Ocultar mensaje de espera
          loading.dismiss();
        });
      });
  }

  async eliminarArchivo(fileURL: string) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000,
    });
    this.firestoreService.eliminarArchivoPorURL(fileURL).then(
      () => {
        toast.present();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
