import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "/@/src/app/app.component";
import { TabComponent } from "/@/src/app/tabbed-pane/tab.component";
import { TabbedPaneComponent } from "/@/src/app/tabbed-pane/tabbed-pane.component";
//
// We can even get rid of the app module
// by directly bootstrapping the AppComponent
// with renderComponent.
//
// However, at the time of writing this, there
// have been some limitations when using
// renderComponents, hence I've decided to
// bootstrap in this traditional way.
//
// Please note that the AppModule just points
// to the AppComponent. Everything else is used
// in an module-less way.
//

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, TabbedPaneComponent, TabComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
