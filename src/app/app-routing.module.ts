import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FirstComponentComponent } from "/@/src/app/page/first-component/first-component.component";
import { SecondComponentComponent } from "/@/src/app/page/second-component/second-component.component";
const routes: Routes = [
  {
    path: "first",
    component: FirstComponentComponent,
  },
  {
    path: "second",
    component: SecondComponentComponent,
  },
  {
    path: "red",
    loadChildren: () =>
      import("./ofmodules/lazy/red/red.module").then((m) => m.RedModule),
  },
  {
    path: "blue",
    loadChildren: () =>
      import("./ofmodules/lazy/blue/blue.module").then((m) => m.BlueModule),
  },

  {
    path: "**",
    component: FirstComponentComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, enableTracing: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
