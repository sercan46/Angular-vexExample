import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialTimelineComponent } from './social-timeline.component';


const routes: Routes = [
  {
    path: '',
    component: SocialTimelineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialTimelineRoutingModule {
}
