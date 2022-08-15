import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MailService } from '../services/mail.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Mail } from '../interfaces/mail.interface';
import icReply from '@iconify/icons-ic/twotone-reply';
import icForward from '@iconify/icons-ic/twotone-forward';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { dropdownAnimation } from '../../../../../@vex/animations/dropdown.animation';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icClose from '@iconify/icons-ic/twotone-close';
import { fadeInUp400ms } from '../../../../../@vex/animations/fade-in-up.animation';
import icArrowBack from '@iconify/icons-ic/twotone-arrow-back';
import { LayoutService } from '../../../../../@vex/services/layout.service';

@Component({
  selector: 'vex-mail-view',
  templateUrl: './mail-view.component.html',
  styleUrls: ['./mail-view.component.scss'],
  animations: [
    dropdownAnimation,
    fadeInUp400ms
  ]
})
export class MailViewComponent implements OnInit, OnDestroy {

  mail$: Observable<Mail> = combineLatest(
    this.route.paramMap.pipe(map(paramMap => +paramMap.get('mailId'))),
    this.mailService.mails$
  ).pipe(
    map(([mailId, mails]) => mails?.find(m => m.id === mailId))
  );

  gtSm$ = this.layoutService.gtSm$;

  icReply = icReply;
  icForward = icForward;
  icDelete = icDelete;
  icMoreVert = icMoreVert;
  icArrowDropDown = icArrowDropDown;
  icClose = icClose;
  icArrowBack = icArrowBack;

  dropdownOpen = true;

  constructor(private route: ActivatedRoute,
              private mailService: MailService,
              private layoutService: LayoutService,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.cd.markForCheck();
  }

  ngOnDestroy() {}
}
