import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { dropdownAnimation } from '../../../../../../@vex/animations/dropdown.animation';
import { MatDialogRef } from '@angular/material/dialog';
import icSend from '@iconify/icons-ic/twotone-send';
import icAttachFile from '@iconify/icons-ic/twotone-attach-file';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import icImage from '@iconify/icons-ic/twotone-image';

@Component({
  selector: 'vex-mail-compose',
  templateUrl: './mail-compose.component.html',
  styleUrls: [
    '../../../../../../../node_modules/quill/dist/quill.snow.css',
    './mail-compose.component.scss'
  ],
  animations: [
    dropdownAnimation
  ],
  encapsulation: ViewEncapsulation.None
})
export class MailComposeComponent implements OnInit {

  icClose = icClose;
  icDelete = icDelete;
  icSend = icSend;
  icAttachFile = icAttachFile;
  icPictureAsPdf = icPictureAsPdf;
  icImage = icImage;

  dropdownOpen = false;

  constructor(private cd: ChangeDetectorRef,
              private dialogRef: MatDialogRef<MailComposeComponent>) { }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.cd.markForCheck();
  }

  submit() {
    this.dialogRef.close();
  }
}
