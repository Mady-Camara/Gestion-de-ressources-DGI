import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtudiant, getEtudiantIdentifier } from '../etudiant.model';

export type EntityResponseType = HttpResponse<IEtudiant>;
export type EntityArrayResponseType = HttpResponse<IEtudiant[]>;

@Injectable({ providedIn: 'root' })
export class EtudiantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etudiants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(etudiant: IEtudiant): Observable<EntityResponseType> {
    return this.http.post<IEtudiant>(this.resourceUrl, etudiant, { observe: 'response' });
  }

  update(etudiant: IEtudiant): Observable<EntityResponseType> {
    return this.http.put<IEtudiant>(`${this.resourceUrl}/${getEtudiantIdentifier(etudiant) as number}`, etudiant, { observe: 'response' });
  }

  partialUpdate(etudiant: IEtudiant): Observable<EntityResponseType> {
    return this.http.patch<IEtudiant>(`${this.resourceUrl}/${getEtudiantIdentifier(etudiant) as number}`, etudiant, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtudiant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByClasse(id: string): Observable<HttpResponse<IEtudiant[]>> {
    return this.http.get<IEtudiant[]>(`${this.resourceUrl}/classe/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtudiant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEtudiantToCollectionIfMissing(etudiantCollection: IEtudiant[], ...etudiantsToCheck: (IEtudiant | null | undefined)[]): IEtudiant[] {
    const etudiants: IEtudiant[] = etudiantsToCheck.filter(isPresent);
    if (etudiants.length > 0) {
      const etudiantCollectionIdentifiers = etudiantCollection.map(etudiantItem => getEtudiantIdentifier(etudiantItem)!);
      const etudiantsToAdd = etudiants.filter(etudiantItem => {
        const etudiantIdentifier = getEtudiantIdentifier(etudiantItem);
        if (etudiantIdentifier == null || etudiantCollectionIdentifiers.includes(etudiantIdentifier)) {
          return false;
        }
        etudiantCollectionIdentifiers.push(etudiantIdentifier);
        return true;
      });
      return [...etudiantsToAdd, ...etudiantCollection];
    }
    return etudiantCollection;
  }
}
