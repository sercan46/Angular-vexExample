import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailRoutingModule } from './mail-routing.module';
import { MailComponent } from './containers/mail.component';
import { ContainerModule } from '../../../../@vex/directives/container/container.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { ScrollbarModule } from '../../../../@vex/components/scrollbar/scrollbar.module';
import { MailListComponent } from './containers/mail-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MailListEntryComponent } from './components/mail-list-entry/mail-list-entry.component';
import { MatRippleModule } from '@angular/material/core';
import { MailViewComponent } from './containers/mail-view.component';
import { MailViewEmptyComponent } from './containers/mail-view-empty.component';
import { RelativeDateTimeModule } from '../../../../@vex/pipes/relative-date-time/relative-date-time.module';
import { MailSidenavComponent } from './components/mail-sidenav/mail-sidenav.component';
import { MailSidenavLinkComponent } from './components/mail-sidenav-link/mail-sidenav-link.component';
import { MatMenuModule } from '@angular/material/menu';
import { StripHtmlModule } from '../../../../@vex/pipes/strip-html/strip-html.module';
import { MailLabelComponent } from './components/mail-label/mail-label.component';
import { MailAttachmentComponent } from './components/mail-attachment/mail-attachment.component';
import { MailComposeComponent } from './components/mail-compose/mail-compose.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { QuillModule } from 'ngx-quill';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MailComponent, MailListComponent, MailListEntryComponent, MailViewComponent, MailViewEmptyComponent, MailSidenavComponent, MailSidenavLinkComponent, MailLabelComponent, MailAttachmentComponent, MailComposeComponent],
  imports: [
    CommonModule,
    MailRoutingModule,
    ContainerModule,
    MatSidenavModule,
    IconModule,
    MatButtonModule,
    ScrollbarModule,
    MatCheckboxModule,
    MatIconModule,
    MatRippleModule,
    RelativeDateTimeModule,
    MatMenuModule,
    StripHtmlModule,
    MatDialogModule,
    MatInputModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],

          [{ list: 'ordered' }, { list: 'bullet' }],

          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          ['clean'],

          ['link', 'image']
        ]
      }
    }),
    MatTooltipModule,
    ReactiveFormsModule,
  ]
})
export class MailModule {
}
