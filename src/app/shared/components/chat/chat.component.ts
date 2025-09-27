import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  messages$!: Observable<Message[]>;
  newMessage: string = '';
  userEmail: string | null = null;
  maxChars = 250;
  private shouldScroll = true;
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
      map(msgs => msgs.sort((a, b) =>
        new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      ))
    );
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    const element = this.messagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (pasted.length > this.maxChars) {
      event.preventDefault();
      this.newMessage = pasted.substring(0, this.maxChars);
    }
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
    this.shouldScroll = true;
  }
}