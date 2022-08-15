# angularjs2-tabs

## Installation

To install this library, run:

```bash
$ npm install angularjs2-tabs --save
```

and then from the Angular `TabsModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the library
import { TabsModule } from 'angularjs2-tabs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify the library as an import
    TabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once the library is imported, you can use its components, directives and pipes in the Angular application:

```xml
<!-- You can now use the library component in app.component.html -->
<h1>
  {{title}}
</h1>
<tabs>
    <tab tabTitle="One">Content for Tab 1</tab>
    <tab tabTitle="Two">Content for Tab 2</tab>
    <tab tabTitle="Three">Content for Tab 3</tab>
</tabs>
```

## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run tsc
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Rohit Kumar](mailto:rohit.kr001@gmail.com)
