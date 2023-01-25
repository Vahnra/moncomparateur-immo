import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DvfMapsComponent } from './maps/dvf-maps/dvf-maps.component';
import { MapsViewComponent } from './maps/maps-view/maps-view.component';

const routes: Routes = [
  { path: '', component: MapsViewComponent },
  { path: 'dvf', component: DvfMapsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
