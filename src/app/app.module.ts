import { HttpClientModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AhorcadoComponent } from './components/games/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './components/games/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './components/games/preguntados/preguntados.component';

import { ChatAhorcadoComponent } from './components/chats/chat-ahorcado/chat-ahorcado.component';
import { ChatMayorMenorComponent } from './components/chats/chat-mayor-menor/chat-mayor-menor.component';
import { ChatSnakeComponent } from './components/chats/chat-snake/chat-snake.component';
import { ChatPreguntadosComponent } from './components/chats/chat-preguntados/chat-preguntados.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';


import { AngularFireModule } from '@angular/fire';

import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SurveyComponent } from './components/survey/survey.component';


@NgModule({
  declarations: [
    AppComponent,
    AhorcadoComponent,
    MayorMenorComponent,
    PreguntadosComponent,
    ChatAhorcadoComponent,
    ChatMayorMenorComponent,
    ChatPreguntadosComponent,
    SurveyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatGridListModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }