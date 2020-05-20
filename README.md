# IonicAsistencia

Aplicacion realizada en Ionic 5 , utilizando Capacitor 1.0 build. 

Pasos para agregar y buildear en Android:
1. agregar path Android Studio en capacitor.config.json, ejemplo:"linuxAndroidStudioPath": "/home/wottan/           android-studio-ide-181.5014246-linux/android-studio/bin/studio.sh".
2. realizar build: ng build --prod
3. agregar android npx cap add android.
4. copiar archivos de la carpeta www: npx cap copy.
5. lanzar Android Studio: npx cap open android.



