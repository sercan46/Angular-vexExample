import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SocialComponent } from './social.component';
import { VexRoutes } from '../../../../@vex/interfaces/vex-route.interface';


const routes: VexRoutes = [
  {
    path: '',
    component: SocialComponent,
    data: {
      toolbarShadowEnabled: true,
      containerEnabled: true
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./social-profile/social-profile.module').then(m => m.SocialProfileModule)
      },
      {
        path: 'timeline',
        loadChildren: () => import('./social-timeline/social-timeline.module').then(m => m.SocialTimelineModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialRoutingModule {
}
