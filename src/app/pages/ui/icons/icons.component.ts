import { Component, OnInit } from '@angular/core';
import icStar from '@iconify/icons-ic/twotone-star';
import icSearch from '@iconify/icons-ic/twotone-search';
import { Link } from '../../../../@vex/interfaces/link.interface';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';


@UntilDestroy()
@Component({
  selector: 'vex-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class IconsComponent implements OnInit {

  searchCtrl = new FormControl();

  colorCtrl = new FormControl();
  color$ = this.colorCtrl.valueChanges;

  links: Link[] = [
    {
      label: 'MATERIAL ICONS',
      route: 'ic'
    },
    {
      label: 'FONT AWESOME',
      route: 'fa'
    },
  ];

  icStar = icStar;
  icSearch = icSearch;

  constructor(private router: Router) { }

  ngOnInit() {
    this.searchCtrl.valueChanges.pipe(
      debounceTime(20),
      untilDestroyed(this)
    ).subscribe(search => this.router.navigate([], { queryParams: { search } }));
  }
}
