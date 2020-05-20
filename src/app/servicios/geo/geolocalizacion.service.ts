import { Injectable, NgZone } from '@angular/core';
import { Plugins, CallbackID } from '@capacitor/core';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {

  options = {
    enableHighAccuracy: true,
    timeout: 0,
    maximumAge: 0
  };

  watchCoords = {
    latitude: 0,
    longitude: 0
  };

  watchId: CallbackID;

  constructor(private zone: NgZone) { }

  async getCurrentPosition() {
    /*     const coordinates = await Geolocation.getCurrentPosition();
        console.log('Current', coordinates); */
    return await Geolocation.getCurrentPosition();
  }

  watchPosition() {
    return Geolocation.watchPosition(this.options, (position, err) => {
      console.log(position);
      return 'latitude ' + position.coords.latitude + ' longitude ' + position.coords.longitude;
    });

    /*    const wait = Geolocation.watchPosition(
         {}, (coordinates, err) => {
           this.Latitude = coordinates.coords.latitude;
           this.Longitude = coordinates.coords.longitude;
         }) */
  }

  async watchPosition2() {
    try {
      this.watchId = Plugins.Geolocation.watchPosition({}, (position, err) => {
        console.log('Watch', position);
        this.zone.run(() => {
          this.watchCoords = position.coords;
        });
      });

      return this.watchCoords;
      // console.log('Got watch', this.watchId);
    } catch (e) {
      alert('WebView geo error');
      console.error(e);
    }
  }

  clearWatch() {
    if (this.watchId != null) {
      Plugins.Geolocation.clearWatch({ id: this.watchId });
    }
  }
}
