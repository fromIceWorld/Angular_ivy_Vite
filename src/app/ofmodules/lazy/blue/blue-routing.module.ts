import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BlueComponent } from "/@/src/app/ofmodules/lazy/blue/blue.component";

const routes: Routes = [
  {
    path: "",
    component: BlueComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlueRoutingModule {}
