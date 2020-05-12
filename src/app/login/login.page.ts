import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth/auth.service';
import { StorageService } from '../servicios/storage/storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  ionicForm: FormGroup;
  defaultDate = "1987-06-30";
  isSubmitted = false;


  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private alertController: AlertController) { }

    async presentAlert() {
      const alert = await this.alertController.create({
        header: 'Error',
        // subHeader: 'Subtitle',
        message: 'Controle Usuario y Contraseña',
        cssClass: 'secondary',
        buttons: ['ACEPTAR']
      });
      await alert.present();
    }
  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(2)]],
      clave: ['', [Validators.required, Validators.minLength(2)]],
      /*       email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
            dob: [this.defaultDate],
            mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]] */
    })
  }

  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.ionicForm.get('dob').setValue(date, {
      onlyself: true
    })
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Escriba todos los valores requeridos!')
      return false;
    } else {
      this.authService.login(this.ionicForm.value).subscribe(res => {
        console.log(res);
        //Se almacenan el token y otros datos del usuario en localStorage
        this.storageService.store('userData', res);
        this.router.navigate(['/tabs']);
      },
      (error => this.presentAlert())
      );
      

      
      console.log(this.ionicForm.value)
    }
    }
     
    // console.error('ERROR')
    // alert('Error');

}
