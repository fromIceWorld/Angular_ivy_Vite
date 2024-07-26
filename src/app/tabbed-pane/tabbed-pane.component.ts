import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { COMMON_DIRECTIVES } from "/@/src/app/common";
import { TabComponent } from "/@/src/app/tabbed-pane/tab.component";
import { ComponentDeps } from "/@/src/app/util";
@ComponentDeps({
  directives: [...COMMON_DIRECTIVES],
})
@Component({
  selector: "tabbed-pane",
  exportAs: "flightTabbedPane",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./tabbed-pane.component.css", "../app.component.css"],
  templateUrl: "./tabbed-pane.component.html",
})
export class TabbedPaneComponent implements AfterContentInit {
  tabs: Array<TabComponent> = [];
  @Input() currentPage: number = 0;
  @Input() title: string;
  @Output() currentPageChange = new EventEmitter<number>();

  get tabsCount() {
    if (!this.tabs) {
      return 0;
    }
    return this.tabs.length;
  }

  public register(tab: TabComponent) {
    this.tabs.push(tab);
  }

  public activate(active: TabComponent) {
    for (const tab of this.tabs) {
      tab.visible = tab === active;
    }
    this.currentPage = this.tabs.indexOf(active);
    this.currentPageChange.next(this.currentPage);
  }

  public activatePage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.activate(this.tabs[pageNumber]);
  }

  ngAfterContentInit() {
    if (this.tabs.length === 0) {
      return;
    }
    this.activate(this.tabs[this.currentPage]);
  }
}
