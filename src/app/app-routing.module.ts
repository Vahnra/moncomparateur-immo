import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapsViewComponent } from './maps/maps-view/maps-view.component';

const routes: Routes = [
  { path: '', component: MapsViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
