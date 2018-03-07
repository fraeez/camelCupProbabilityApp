import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';
import {
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  MatCardModule,
  MatDialogModule
} from '@angular/material';
import {
  FlexLayoutModule
} from '@angular/flex-layout';


import {
  AppComponent
} from './app.component';
import {
  GameComponent
} from './game/game.component';

import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  WelcomeComponent
} from './welcome/welcome.component';
import { HelpersService } from './helpers.service';
import { ModalDiceComponent } from './modal-dice/modal-dice.component';

const appRoutes: Routes = [{
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'game',
    component: GameComponent
  },

  {
    path: '**',
    redirectTo: '/welcome',
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    WelcomeComponent,
    ModalDiceComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FlexLayoutModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  entryComponents:[ModalDiceComponent],
  providers: [HelpersService],
  bootstrap: [AppComponent]
})
export class AppModule {}
