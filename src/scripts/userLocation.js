import { viewer } from "./displayMap";
import userIconPNG from '../assets/userIcon.png';
import * as Cesium from "cesium";

let watchId = null;
let userEntity = null; // <- zapamiętujemy encję poza funkcją

const userPositionFollow = () => {
    if (watchId !== null) {
        console.log("Śledzenie już aktywne. Zatrzymuję...");
        navigator.geolocation.clearWatch(watchId);
        watchId = null;

        if (userEntity) {
            viewer.entities.remove(userEntity); // teraz działa!
            userEntity = null;
        }

        return;
    }

  // Tworzymy ikonkę i encję


    userEntity = viewer.entities.add({
        name: "Moja lokalizacja",
        position: Cesium.Cartesian3.fromDegrees(0, 0),
        billboard: {
            image: userIconPNG,
            width: 24,
            height: 24,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    });

    watchId = navigator.geolocation.watchPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const alt = position.coords.altitude || 0;

        const height = 1000;
        const destination = Cesium.Cartesian3.fromDegrees(lon, lat, height);

        if (userEntity) {
        userEntity.position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
        }

        viewer.camera.setView({
            destination: destination,
            orientation: {
                heading: 0.0,
                pitch: -Math.PI / 2,
                roll: 0.0
            }
        });
        },
        (error) => {
        console.error("Błąd lokalizacji:", error.message);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 100,
        timeout: 10000
    }
    );
};

export default userPositionFollow;
