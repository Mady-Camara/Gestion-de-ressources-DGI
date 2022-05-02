import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  ok: boolean;
  constructor() {
    this.ok = true;
  }

  ngOnInit(): void {
    this.ok = true;
  }
}
