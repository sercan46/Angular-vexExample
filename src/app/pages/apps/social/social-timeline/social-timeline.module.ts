import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialTimelineRoutingModule } from './social-timeline-routing.module';
import { SocialTimelineComponent } from './social-timeline.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { SocialTimelineEntryComponent } from './components/social-timeline-entry/social-timeline-entry.component';


@NgModule({
  declarations: [SocialTimelineComponent, SocialTimelineEntryComponent],
  imports: [
    CommonModule,
    SocialTimelineRoutingModule,
    FlexLayoutModule,
    MatTabsModule,
    MatIconModule,
    IconModule,
    MatButtonModule,
    MatInputModule,
    MatRippleModule
  ]
})
export class SocialTimelineModule {
}
