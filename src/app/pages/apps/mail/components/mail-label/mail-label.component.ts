import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vex-mail-label',
  templateUrl: './mail-label.component.html',
  styleUrls: ['./mail-label.component.scss']
})
export class MailLabelComponent implements OnInit {

  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
  }

}
