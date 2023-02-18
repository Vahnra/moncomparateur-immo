import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchPasswordDirective } from 'src/app/directives/match-password.directive';



@NgModule({
  declarations: [MatchPasswordDirective],
  exports: [MatchPasswordDirective],
  imports: [
    CommonModule
  ]
})
export class PasswordDirectiveModule { }
