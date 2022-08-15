import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { scaleFadeIn400ms } from '../../../../../@vex/animations/scale-fade-in.animation';
import { combineLatest, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { iconsIC } from '../../../../../static-data/icons-ic';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'vex-icons-ic',
  templateUrl: './icons-ic.component.html',
  styleUrls: ['./icons-ic.component.scss'],
  animations: [
    scaleFadeIn400ms
  ]
})
export class IconsIcComponent implements OnInit {

  static fontLoaded: boolean;
  filteredIcons$: Observable<any[]> = combineLatest([
    this.route.queryParamMap.pipe(
      map(paramMap => paramMap.get('search')),
      startWith('')
    ),
    this.breakpointObserver.observe(`(min-width: 600px)`).pipe(
      map(state => state.matches)
    )
  ]).pipe(
    map(([value, isDesktop]: [string, boolean]) => {
      const filteredIcons = iconsIC.filter(iconName => iconName.includes((value || '').toLowerCase()));

      return filteredIcons.reduce((prev, curr, index) => {
        if (isDesktop) {
          if (index % 4 === 0) {
            prev.push([]);
          }
        } else {
          if (index % 2 === 0) {
            prev.push([]);
          }
        }

        prev[prev.length - 1] = [
          ...prev[prev.length - 1],
          curr
        ];
        return prev;
      }, [[]]);
    })
  );

  constructor(private route: ActivatedRoute,
              private breakpointObserver: BreakpointObserver,
              @Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2) { }

  ngOnInit() {
    if (!IconsIcComponent.fontLoaded) {
      this.loadFont();
    }
  }

  loadFont() {
    IconsIcComponent.fontLoaded = true;
    const linkElem = this.renderer.createElement('link');
    this.renderer.setAttribute(linkElem, 'rel', 'stylesheet');
    this.renderer.setAttribute(linkElem, 'href', 'https://fonts.googleapis.com/css?family=Material+Icons+Two+Tone');
    this.renderer.appendChild(this.document?.head, linkElem);
  }
}
