import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClassRoom } from '../class-room.model';

@Component({
  selector: 'jhi-class-room-detail',
  templateUrl: './class-room-detail.component.html',
})
export class ClassRoomDetailComponent implements OnInit {
  classRoom: IClassRoom | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ classRoom }) => {
      this.classRoom = classRoom;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
