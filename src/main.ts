import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "/@/src/app/app.module";
console.log(AppModule, AppModule["ɵinj"], AppModule["ɵmod"]);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// Alternative: Directly bootstrap AppComponent w/o AppModule
// More Infos: see app.module.ts
// renderComponent(AppComponent, {
//   rendererFactory: null
// });
