import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialProfileComponent } from './social-profile.component';


const routes: Routes = [
  {
    path: '',
    component: SocialProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialProfileRoutingModule {
}
