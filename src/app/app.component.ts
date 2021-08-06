import { Component } from "@angular/core";
// import { TABBEND_PANE_COMPONENTS } from "/@/src/app/tabbed-pane";
// import { ComponentDeps } from "/@/src/app/util";

@Component({
  selector: "app-root",
  template: "<h1> Welcome to {{ title }}!</h1>",
})
// @ComponentDeps({
//   directives: [...TABBEND_PANE_COMPONENTS],
// })
export class AppComponent {
  title = "demo";
}
