import { ApplicationRef } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "/@/src/app/app.module";
const platForm = platformBrowserDynamic();
const NgModule = platForm.bootstrapModule(AppModule);

NgModule.then((m) => {
  window["platForm"] = platForm as any;
  window["appModule"] = m as any;
  window["ApplicationRef"] = (m as any).get(ApplicationRef);
  console.log(m, (m as any).get(ApplicationRef));
}).catch((err) => console.error(err));

// Alternative: Directly bootstrap AppComponent w/o AppModule
// More Infos: see app.module.ts
// renderComponent(AppComponent, {
//   rendererFactory: null
// });
