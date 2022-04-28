import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ModuleComponent } from '../list/module.component';
import { ModuleDetailComponent } from '../detail/module-detail.component';
import { ModuleUpdateComponent } from '../update/module-update.component';
import { ModuleRoutingResolveService } from './module-routing-resolve.service';

const moduleRoute: Routes = [
  {
    path: '',
    component: ModuleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ModuleDetailComponent,
    resolve: {
      module: ModuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ModuleUpdateComponent,
    resolve: {
      module: ModuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ModuleUpdateComponent,
    resolve: {
      module: ModuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(moduleRoute)],
  exports: [RouterModule],
})
export class ModuleRoutingModule {}
