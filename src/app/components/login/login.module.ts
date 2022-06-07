import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';




@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatSliderModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatSortModule,
    MatDialogModule,
    MatOptionModule,
    FormsModule
  ]
})
export class LoginModule { }
