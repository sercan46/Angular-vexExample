import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LayoutService } from '../../../../../@vex/services/layout.service';
import { map } from 'rxjs/operators';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import icMail from '@iconify/icons-ic/twotone-mail';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icSearch from '@iconify/icons-ic/twotone-search';
import icMenu from '@iconify/icons-ic/twotone-menu';
import { scaleIn400ms } from '../../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../../@vex/animations/fade-in-right.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';
import { MailComposeComponent } from '../components/mail-compose/mail-compose.component';
import { FormControl } from '@angular/forms';
import { MailService } from '../services/mail.service';


@UntilDestroy()
@Component({
  selector: 'vex-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms
  ],
  encapsulation: ViewEncapsulation.None
})
export class MailComponent implements OnInit {

  isDesktop$ = this.layoutService.isDesktop$;
  ltLg$ = this.layoutService.ltLg$;
  drawerMode$: Observable<MatDrawerMode> = this.isDesktop$.pipe(
    map(isDesktop => isDesktop ? 'side' : 'over')
  );
  drawerOpen = true;

  searchCtrl = new FormControl();

  icMail = icMail;
  icSearch = icSearch;
  icEdit = icEdit;
  icMenu = icMenu;

  @ViewChild(MatDrawer, { static: true }) private drawer: MatDrawer;

  constructor(private layoutService: LayoutService,
              private mailService: MailService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    /**
     * Expand Drawer when we switch from mobile to desktop view
     */
    this.isDesktop$.pipe(
      untilDestroyed(this)
    ).subscribe(isDesktop => {
      if (isDesktop) {
        this.drawer?.open();
      } else {
        this.drawer?.close();
      }
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.mailService.filterValue.next(value));
  }

  openCompose() {
    this.dialog.open(MailComposeComponent, {
      width: '100%',
      maxWidth: 600
    });
  }
}
