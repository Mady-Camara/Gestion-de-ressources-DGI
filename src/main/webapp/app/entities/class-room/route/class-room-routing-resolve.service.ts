import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClassRoom, ClassRoom } from '../class-room.model';
import { ClassRoomService } from '../service/class-room.service';

@Injectable({ providedIn: 'root' })
export class ClassRoomRoutingResolveService implements Resolve<IClassRoom> {
  constructor(protected service: ClassRoomService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClassRoom> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((classRoom: HttpResponse<ClassRoom>) => {
          if (classRoom.body) {
            return of(classRoom.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ClassRoom());
  }
}
