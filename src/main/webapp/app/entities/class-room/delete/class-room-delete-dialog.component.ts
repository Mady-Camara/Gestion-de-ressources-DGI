import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClassRoom } from '../class-room.model';
import { ClassRoomService } from '../service/class-room.service';

@Component({
  templateUrl: './class-room-delete-dialog.component.html',
})
export class ClassRoomDeleteDialogComponent {
  classRoom?: IClassRoom;

  constructor(protected classRoomService: ClassRoomService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.classRoomService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
