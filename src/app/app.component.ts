import { Component } from "@angular/core";
// import { TABBEND_PANE_COMPONENTS } from "/@/src/app/tabbed-pane";
// import { ComponentDeps } from "/@/src/app/util";

@Component({
  selector: "app-root",
  template: `<h1>Welcome to {{ title }}!</h1>
    <tabbed-pane>
      <tab title="Tab 1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt,
        reiciendis? Omnis sapiente aperiam tempore est quasi ut eaque tempora,
        quas nihil similique ex nulla nam, minus laudantium! Adipisci, corrupti
        dolores?
      </tab>
      <tab title="Tab 2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
        exercitationem delectus consequatur. Rem neque consequuntur accusantium
        vel magni maxime deserunt ad hic similique enim, nesciunt explicabo ut
        voluptatum nostrum aliquid.
      </tab>
      <tab title="Tab 3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
        deleniti ipsa corporis placeat accusamus laudantium illo ut adipisci ea.
        Laudantium fugiat nisi optio, cupiditate aliquid excepturi laborum ea
        perspiciatis autem?
      </tab>
    </tabbed-pane>`,
})
// @ComponentDeps({
//   directives: [...TABBEND_PANE_COMPONENTS],
// })
export class AppComponent {
  title = "demo";
}
