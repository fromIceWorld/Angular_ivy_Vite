import { Component, OnInit } from "@angular/core";
// import { TABBEND_PANE_COMPONENTS } from "/@/src/app/tabbed-pane";
// import { ComponentDeps } from "/@/src/app/util";

@Component({
  selector: "app-root",
  styleUrls: ["./app.component.css"],
  templateUrl: "./app.component.html",
})
// @ComponentDeps({
//   directives: [...TABBEND_PANE_COMPONENTS],
// })
export class AppComponent implements OnInit {
  title = "";
  varAdd = "";
  ngOnInit() {
    setTimeout(() => {
      this.varAdd = "var1变换";
      this.title = "title变换";
    }, 1000);
  }
}
