import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


// Permet de regrouper les imports indispensables
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule { }
