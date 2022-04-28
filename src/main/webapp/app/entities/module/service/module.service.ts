import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IModule, getModuleIdentifier } from '../module.model';

export type EntityResponseType = HttpResponse<IModule>;
export type EntityArrayResponseType = HttpResponse<IModule[]>;

@Injectable({ providedIn: 'root' })
export class ModuleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/modules');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(module: IModule): Observable<EntityResponseType> {
    return this.http.post<IModule>(this.resourceUrl, module, { observe: 'response' });
  }

  update(module: IModule): Observable<EntityResponseType> {
    return this.http.put<IModule>(`${this.resourceUrl}/${getModuleIdentifier(module) as number}`, module, { observe: 'response' });
  }

  partialUpdate(module: IModule): Observable<EntityResponseType> {
    return this.http.patch<IModule>(`${this.resourceUrl}/${getModuleIdentifier(module) as number}`, module, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IModule>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserModule(): Observable<EntityArrayResponseType> {
    return this.http.get<IModule[]>(`${this.resourceUrl}/user`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IModule[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addModuleToCollectionIfMissing(moduleCollection: IModule[], ...modulesToCheck: (IModule | null | undefined)[]): IModule[] {
    const modules: IModule[] = modulesToCheck.filter(isPresent);
    if (modules.length > 0) {
      const moduleCollectionIdentifiers = moduleCollection.map(moduleItem => getModuleIdentifier(moduleItem)!);
      const modulesToAdd = modules.filter(moduleItem => {
        const moduleIdentifier = getModuleIdentifier(moduleItem);
        if (moduleIdentifier == null || moduleCollectionIdentifiers.includes(moduleIdentifier)) {
          return false;
        }
        moduleCollectionIdentifiers.push(moduleIdentifier);
        return true;
      });
      return [...modulesToAdd, ...moduleCollection];
    }
    return moduleCollection;
  }
}
