import { Component, NgModule, OnInit, ContentChildren, Input,
    QueryList, AfterContentInit, Renderer } from '@angular/core';

import { TabComponent } from './tab.component';

// tabs.ts
@Component({
    selector: 'tabs',
    styles: [`
        .ng2-tabs ul{
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .ng2-tabs ul:after {
            content: "";
            width: 100%;
            height: 1px;
            display: block;
            clear: both;
        }

        .ng2-tabs ul li {
            float: left;
            margin-left: 2px;
        }

        .ng2-tabs ul li:first-child {
            margin-left: 0;
        }

        .ng2-tabs ul li a {
            display: block;
            padding: 5px 10px;
            text-decoration: none;
            color: #000;
            border: 1px solid #ccc;
            border-bottom: none;
            margin-bottom: -2px;
            background-color: #ccc;
        }

        .ng2-tabs ul li.active a {
            position: relative;
            z-index: 2;
            background-color: #fff;
        }

        .ng2-tabs .tab-content {
            border: 1px solid #ccc;
            padding: 10px;
            box-sizing: border-box;
        }
    `],
    template: `
        <div class="ng2-tabs">
            <ul>
                <li *ngFor="let tab of tabs;  let i = index" [class.active]="tab.selected">
                    <a href="javascript:void(0)" (click)="selectTab(tab)">{{tab.tabTitle}}</a>
                </li>
            </ul>
            <div class="tab-content">
                <ng-content></ng-content>
            </div>
        <div>
    `
})


export class TabsComponent implements AfterContentInit {

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    @Input() classNames: string;

    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.selected);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    constructor() {

    }

    selectTab(tab: TabComponent) {
        this.tabs.map((_tab) => {
            _tab.selected = false;
        });
        tab.selected = true;
    }
}
