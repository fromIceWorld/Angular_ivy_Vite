import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RedRoutingModule } from "/@/src/app/ofmodules/lazy/red/red-routing.module";
import { RedComponent } from "/@/src/app/ofmodules/lazy/red/red.component";

@NgModule({
  declarations: [RedComponent],
  imports: [CommonModule, RedRoutingModule],
})
export class RedModule {}
