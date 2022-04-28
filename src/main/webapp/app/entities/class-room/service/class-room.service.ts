import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClassRoom, getClassRoomIdentifier } from '../class-room.model';

export type EntityResponseType = HttpResponse<IClassRoom>;
export type EntityArrayResponseType = HttpResponse<IClassRoom[]>;

@Injectable({ providedIn: 'root' })
export class ClassRoomService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/class-rooms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(classRoom: IClassRoom): Observable<EntityResponseType> {
    return this.http.post<IClassRoom>(this.resourceUrl, classRoom, { observe: 'response' });
  }

  update(classRoom: IClassRoom): Observable<EntityResponseType> {
    return this.http.put<IClassRoom>(`${this.resourceUrl}/${getClassRoomIdentifier(classRoom) as number}`, classRoom, {
      observe: 'response',
    });
  }

  partialUpdate(classRoom: IClassRoom): Observable<EntityResponseType> {
    return this.http.patch<IClassRoom>(`${this.resourceUrl}/${getClassRoomIdentifier(classRoom) as number}`, classRoom, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClassRoom>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClassRoom[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClassRoomToCollectionIfMissing(
    classRoomCollection: IClassRoom[],
    ...classRoomsToCheck: (IClassRoom | null | undefined)[]
  ): IClassRoom[] {
    const classRooms: IClassRoom[] = classRoomsToCheck.filter(isPresent);
    if (classRooms.length > 0) {
      const classRoomCollectionIdentifiers = classRoomCollection.map(classRoomItem => getClassRoomIdentifier(classRoomItem)!);
      const classRoomsToAdd = classRooms.filter(classRoomItem => {
        const classRoomIdentifier = getClassRoomIdentifier(classRoomItem);
        if (classRoomIdentifier == null || classRoomCollectionIdentifiers.includes(classRoomIdentifier)) {
          return false;
        }
        classRoomCollectionIdentifiers.push(classRoomIdentifier);
        return true;
      });
      return [...classRoomsToAdd, ...classRoomCollection];
    }
    return classRoomCollection;
  }
}
