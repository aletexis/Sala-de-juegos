import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FirestoreService } from '../../../core/services/firestore.service';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../core/services/session.service';
import { Message } from '../../../core/models/message';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @Input() game!: string;
  messages$!: Observable<Message[]>;
  newMessage: string = '';
  userEmail: string | null = null;

  private chatCollections: Record<string, string> = {
    'ahorcado': 'chatAhorcado',
    'mayor-menor': 'chatMayorMenor',
    'preguntados': 'chatPreguntados',
    'viborita': 'chatSnake'
  };

  constructor(private firestoreService: FirestoreService, private session: SessionService) { }

  ngOnInit() {
    this.userEmail = this.session.userEmail;
    const collectionName = this.chatCollections[this.game];
    this.messages$ = this.firestoreService.getAll<Message>(collectionName).pipe(
      map(msgs => msgs.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()))
    );
  }

  async sendMessage() {
    if (!this.newMessage.trim() || !this.userEmail) return;

    const collectionName = this.chatCollections[this.game];

    await this.firestoreService.create(collectionName, {
      user: this.userEmail,
      message: this.newMessage,
      datetime: new Date().toISOString()
    });

    this.newMessage = '';
  }
}