import { Injectable } from "@angular/core";

@Injectable({
  providedIn: null,
})
export class FirstComponentService {
  constructor() {}
  warning() {
    console.log("warning!");
  }
}
