import { Component, OnInit } from '@angular/core';

import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

import * as L from 'leaflet';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {
  map: any;

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    let latitud = 36.52974804381493;
    let longitud = -6.193936608988772;
    let zoom = 17;
    this.map = L.map('mapId').setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );
  }

  constructor(private callNumber: CallNumber) {}

  ngOnInit() {}

  call(): void {
    const phoneNumber = '+34646566660';
    this.callNumber
      .callNumber(phoneNumber, true)
      .then(() => console.log('Llamada exitosa'))
      .catch((error) => console.log('Error llamada', error));
  }
}
