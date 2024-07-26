import { Component, Inject, Input, OnInit } from "@angular/core";
import { FirstComponentService } from "/@/src/app/page/first-component/first-component.service";
@Component({
  selector: "app-first-component",
  template: "first-component-93644\n[{{titleIn}}]\n",
})
export class FirstComponentComponent implements OnInit {
  constructor(@Inject(FirstComponentService) private service) {}
  @Input() titleIn: string = "";
  ngOnInit(): void {
    console.log(this.service);
  }
}
