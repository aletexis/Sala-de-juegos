import { ChatMayorMenorService } from '../../services/chatMayorMenor.service';

import { Component, Input, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Mensaje } from '../../classes/mensaje';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-chat-mayor-menor',
  templateUrl: './chatMayorMenor.component.html',
  styleUrls: ['./chatMayorMenor.component.css']
})

export class ChatMayorMenorComponent implements AfterViewInit, OnInit {
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  mensaje: Mensaje;
  item$: Observable<any[]>;
  token: any;
  d = new Date();
  private scrollContainer: any;

  //hora: string;

  constructor(private router: Router, private MiServicio: ChatMayorMenorService, firestore: ChatMayorMenorService) {

    this.mensaje = new Mensaje();
    this.item$ = firestore.ObtenerTodos().valueChanges();
    this.mensaje.usuario = localStorage.getItem('token') || 'Anonimo';
    this.mensaje.hora = this.d.getHours() + ':' + this.d.getMinutes();
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token == null) {
      this.router.navigateByUrl("login");
    }
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  Enviar() {
    this.MiServicio.Crear(this.mensaje).then(() => {
      this.mensaje.mensaje = '';
      console.log('se envio el msj FIRE', this.token);
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl("login");
  }
}
