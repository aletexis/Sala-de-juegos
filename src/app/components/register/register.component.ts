import { Component, OnInit } from '@angular/core';
import { UsuarioFireService } from './../../services/usuarios.service';
import { Usuario } from '../../classes/usuario'
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal, { SweetAlertIcon } from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  unUsuario: Usuario;


  constructor(private MiServicio: UsuarioFireService, private router: Router, public dialog: MatDialog) {
    this.unUsuario = new Usuario();
  }

  alert(icon: SweetAlertIcon, text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: text
    })
  }



  correo = new FormControl('', [Validators.required, Validators.email]);
  clave = new FormControl('', [Validators.required]);

  getErrorMessageCorreo() {
    if (this.correo.hasError('required')) {
      return 'Ingrese un correo';
    }

    return this.correo.hasError('email') ? 'El correo no es válido' : '';

  }

  getErrorMessageClave() {
    if (this.clave.hasError('required')) {

      return 'Ingrese una contraseña';
    }

    return this.clave.hasError('') ? 'La contraseña no es válida' : '';

  }

  Registro() {

    this.alert('info', 'Verificando credenciales')

    if (!(this.unUsuario.clave == '' && this.unUsuario.correo == ''))
    {
      console.log('existe');

      this.MiServicio.BuscarUsuario(this.unUsuario).valueChanges().subscribe(result => {
        if (result.length == 0) {

          this.MiServicio.Crear(this.unUsuario).then(() => {

            this.alert('success', 'Estás registrado, vamos a jugar!')
            localStorage.setItem('token', this.unUsuario.correo);
            this.router.navigateByUrl("home");
            return;
          })
        }
        else {
          console.log('existe');
          //this.dialog.open(DialogElementsExampleDialog); 
        }
      })
    }
  }

  ngOnInit(): void {
  }

}