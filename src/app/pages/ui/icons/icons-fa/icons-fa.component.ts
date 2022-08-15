import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { iconsFA } from '../../../../../static-data/icons-fa';
import { scaleFadeIn400ms } from '../../../../../@vex/animations/scale-fade-in.animation';
import { combineLatest, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'vex-icons-fa',
  templateUrl: './icons-fa.component.html',
  styleUrls: ['./icons-fa.component.scss'],
  animations: [
    scaleFadeIn400ms
  ]
})
export class IconsFaComponent implements OnInit {

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
      const filteredIcons = iconsFA.filter(iconName => iconName.includes((value || '').toLowerCase()));

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
    if (!IconsFaComponent.fontLoaded) {
      this.loadFont();
    }
  }

  loadFont() {
    IconsFaComponent.fontLoaded = true;
    const scriptElem = this.renderer.createElement('script');
    this.renderer.setAttribute(scriptElem, 'crossorigin', 'anonymous');
    this.renderer.setAttribute(scriptElem, 'src', 'https://kit.fontawesome.com/24a46da608.js');
    this.renderer.appendChild(this.document?.head, scriptElem);
  }
}
