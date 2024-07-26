import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BlueRoutingModule } from "/@/src/app/ofmodules/lazy/blue/blue-routing.module";
import { BlueComponent } from "/@/src/app/ofmodules/lazy/blue/blue.component";
@NgModule({
  declarations: [BlueComponent],
  imports: [CommonModule, BlueRoutingModule],
})
export class BlueModule {}
