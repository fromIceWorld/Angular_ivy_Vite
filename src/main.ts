import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "/@/src/app/app.module";
import { TabComponent } from "/@/src/app/tabbed-pane/tab.component";
console.log(
  TabComponent["ɵcmp"],
  TabComponent["ɵfac"],
  TabComponent["ctorParameters"]
);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// Alternative: Directly bootstrap AppComponent w/o AppModule
// More Infos: see app.module.ts
// renderComponent(AppComponent, {
//   rendererFactory: null
// });
