import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabsComponent} from './src/tabs.component';
import {TabComponent} from './src/tab.component';
import {TabsDirective} from './src/tabs.directive';
import {TabsPipe} from './src/tabs.pipe';
import {TabsService} from './src/tabs.service';

export * from './src/tabs.component';
export * from './src/tabs.directive';
export * from './src/tabs.pipe';
export * from './src/tabs.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TabsComponent,
    TabComponent,
    TabsDirective,
    TabsPipe
  ],
  exports: [
    TabsComponent,
    TabComponent,
    TabsDirective,
    TabsPipe
  ]
})
export class TabsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TabsModule,
      providers: [TabsService]
    };
  }
}
