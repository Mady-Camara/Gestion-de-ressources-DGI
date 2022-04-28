import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClassRoomComponent } from './list/class-room.component';
import { ClassRoomDetailComponent } from './detail/class-room-detail.component';
import { ClassRoomUpdateComponent } from './update/class-room-update.component';
import { ClassRoomDeleteDialogComponent } from './delete/class-room-delete-dialog.component';
import { ClassRoomRoutingModule } from './route/class-room-routing.module';

@NgModule({
  imports: [SharedModule, ClassRoomRoutingModule],
  declarations: [ClassRoomComponent, ClassRoomDetailComponent, ClassRoomUpdateComponent, ClassRoomDeleteDialogComponent],
  entryComponents: [ClassRoomDeleteDialogComponent],
})
export class ClassRoomModule {}
