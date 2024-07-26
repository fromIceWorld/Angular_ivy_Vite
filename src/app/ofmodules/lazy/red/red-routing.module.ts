import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RedComponent } from "/@/src/app/ofmodules/lazy/red/red.component";

const routes: Routes = [
  {
    path: "",
    component: RedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedRoutingModule {}
