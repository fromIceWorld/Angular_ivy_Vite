import { Component, Inject, Input, OnInit } from "@angular/core";
import { COMMON_DIRECTIVES } from "/@/src/app/common";
import { TabbedPaneComponent } from "/@/src/app/tabbed-pane/tabbed-pane.component";
import { ComponentDeps } from "/@/src/app/util";
@ComponentDeps({
  directives: [...COMMON_DIRECTIVES],
})
@Component({
  selector: "tab",
  template: `
    <div *ngIf="visible">
      <h2>{{ title }}</h2>
      <ng-content></ng-content>
    </div>
  `,
})
export class TabComponent implements OnInit {
  public visible: boolean = false;
  @Input() public title: string;

  constructor(@Inject(TabbedPaneComponent) private tabs) {}

  ngOnInit() {
    if (this.tabs) {
      this.tabs.register(this);
    }
  }
}
