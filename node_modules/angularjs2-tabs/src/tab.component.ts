import { Component, Input, OnInit } from '@angular/core';

// tab.ts
@Component({
    selector: 'tab',
    template: `<div [hidden]="!selected">
        <ng-content></ng-content>
    </div>
`
})
export class TabComponent implements OnInit {

    @Input() tabTitle: string;

    selected: boolean;

    ngOnInit() {

    }

}
