# IonicAsistencia

Aplicacion realizada en Ionic 5 , utilizando Capacitor 1.0 build. 

Pasos para agregar y buildear en Android:
-agregar path Android Studio en capacitor.config.json, ejemplo:"linuxAndroidStudioPath": "/home/wottan/           android-studio-ide-181.5014246-linux/android-studio/bin/studio.sh"
-realizar build: ng build --prod
-agregar android npx cap add android.
-copiar archivos de la carpeta www: npx cap copy
-lanzar Android Studio: npx cap open android.

