import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mail } from '../../interfaces/mail.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';
import icStar from '@iconify/icons-ic/star';
import icStarBorder from '@iconify/icons-ic/star-border';
import { MailService } from '../../services/mail.service';

@Component({
  selector: 'vex-mail-list-entry',
  templateUrl: './mail-list-entry.component.html',
  styleUrls: ['./mail-list-entry.component.scss']
})
export class MailListEntryComponent implements OnInit {

  @Input() mail: Mail;
  @Input() selected: boolean;
  @Output() selectedChange = new EventEmitter<boolean>();

  hovered: boolean;

  icStar = icStar;
  icStarBorder = icStarBorder;

  constructor(private cd: ChangeDetectorRef,
              private mailService: MailService) { }

  ngOnInit(): void {
  }

  isCheckboxVisible() {
    return this.selected || this.hovered;
  }

  isStarVisible() {
    return this.mail?.starred || this.isCheckboxVisible();
  }

  onMouseEnter() {
    this.hovered = true;
    this.cd.markForCheck();
  }

  onMouseLeave() {
    this.hovered = false;
    this.cd.markForCheck();
  }

  onCheckboxChange(event: MatCheckboxChange) {
    this.selectedChange.emit(event.checked);
  }

  toggleStar(event: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();

    this.mail.starred = !this.mail.starred;
    this.cd.markForCheck();
  }

  markMailAsRead(mailId: Mail['id']) {
    this.mailService.markMailAsRead(mailId);
  }
}
