import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClassRoomComponent } from '../list/class-room.component';
import { ClassRoomDetailComponent } from '../detail/class-room-detail.component';
import { ClassRoomUpdateComponent } from '../update/class-room-update.component';
import { ClassRoomRoutingResolveService } from './class-room-routing-resolve.service';

const classRoomRoute: Routes = [
  {
    path: '',
    component: ClassRoomComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClassRoomDetailComponent,
    resolve: {
      classRoom: ClassRoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClassRoomUpdateComponent,
    resolve: {
      classRoom: ClassRoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClassRoomUpdateComponent,
    resolve: {
      classRoom: ClassRoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(classRoomRoute)],
  exports: [RouterModule],
})
export class ClassRoomRoutingModule {}
