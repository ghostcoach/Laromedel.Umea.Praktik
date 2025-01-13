import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
    imports: [CommonModule],
    template: ""
})
export class PdfRedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const documentName: string = this.route.snapshot.data["document"];
    window.location.replace(`/assets/documents/${documentName}`);
  }
}
