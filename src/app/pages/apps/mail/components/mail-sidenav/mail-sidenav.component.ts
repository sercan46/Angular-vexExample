import { Component, Input, OnInit } from '@angular/core';
import icInbox from '@iconify/icons-ic/twotone-inbox';
import { MailSidenavLink } from '../../interfaces/mail-sidenav-link.interface';
import icStar from '@iconify/icons-ic/twotone-star';
import icAllInbox from '@iconify/icons-ic/twotone-all-inbox';
import icDrafts from '@iconify/icons-ic/twotone-drafts';
import icSend from '@iconify/icons-ic/twotone-send';
import { MatDrawer } from '@angular/material/sidenav';
import { LayoutService } from '../../../../../../@vex/services/layout.service';
import icLabelImportant from '@iconify/icons-ic/twotone-label-important';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icLock from '@iconify/icons-ic/twotone-lock';
import { stagger40ms } from '../../../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms } from '../../../../../../@vex/animations/fade-in-up.animation';

@Component({
  selector: 'vex-mail-sidenav',
  templateUrl: './mail-sidenav.component.html',
  styleUrls: ['./mail-sidenav.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})
export class MailSidenavComponent implements OnInit {

  @Input() drawer: MatDrawer;

  links: MailSidenavLink[] = [
    {
      label: 'Inbox',
      route: ['./inbox'],
      icon: icInbox
    },
    {
      label: 'All Mails',
      route: ['./all'],
      icon: icAllInbox
    },
    {
      label: 'Starred',
      route: ['./starred'],
      icon: icStar
    },
    {
      label: 'Drafts',
      route: ['./drafts'],
      icon: icDrafts
    },
    {
      label: 'Sent',
      route: ['./sent'],
      icon: icSend
    }
  ];

  labelLinks: MailSidenavLink[] = [
    {
      label: 'Important',
      route: ['./important'],
      icon: icLabelImportant
    },
    {
      label: 'Business',
      route: ['./business'],
      icon: icBusiness
    },
    {
      label: 'Secret',
      route: ['./secret'],
      icon: icLock
    }
  ];

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
  }

  closeDrawer() {
    if (this.layoutService.isLtLg()) {
      this.drawer?.close();
    }
  }
}
