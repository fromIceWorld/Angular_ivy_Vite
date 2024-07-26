import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "/@/src/app/app-routing.module";
import { AppComponent } from "/@/src/app/app.component";
import { FirstComponentComponent } from "/@/src/app/page/first-component/first-component.component";
import { FirstComponentService } from "/@/src/app/page/first-component/first-component.service";
import { SecondComponentComponent } from "/@/src/app/page/second-component/second-component.component";
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
  imports: [BrowserModule, AppRoutingModule],
  declarations: [
    AppComponent,
    TabbedPaneComponent,
    TabComponent,
    FirstComponentComponent,
    SecondComponentComponent,
  ],
  providers: [FirstComponentService],
  bootstrap: [AppComponent],
})
export class AppModule {}
