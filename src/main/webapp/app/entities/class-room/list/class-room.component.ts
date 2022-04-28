import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClassRoom } from '../class-room.model';
import { ClassRoomService } from '../service/class-room.service';
import { ClassRoomDeleteDialogComponent } from '../delete/class-room-delete-dialog.component';

@Component({
  selector: 'jhi-class-room',
  templateUrl: './class-room.component.html',
})
export class ClassRoomComponent implements OnInit {
  classRooms?: IClassRoom[];
  isLoading = false;

  constructor(protected classRoomService: ClassRoomService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.classRoomService.query().subscribe({
      next: (res: HttpResponse<IClassRoom[]>) => {
        this.isLoading = false;
        this.classRooms = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IClassRoom): number {
    return item.id!;
  }

  delete(classRoom: IClassRoom): void {
    const modalRef = this.modalService.open(ClassRoomDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.classRoom = classRoom;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
