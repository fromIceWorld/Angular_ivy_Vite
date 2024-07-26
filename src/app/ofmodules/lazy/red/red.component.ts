import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-red",
  templateUrl: "./red.component.html",
  styleUrls: ["./red.component.css"],
})
export class RedComponent implements OnInit {
  constructor() {}
  @Input() in: string = "";
  ngOnInit(): void {}
}
