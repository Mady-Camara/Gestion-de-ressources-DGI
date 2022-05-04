import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EtudiantService } from '../service/etudiant.service';

import { EtudiantComponent } from './etudiant.component';

describe('Etudiant Management Component', () => {
  let comp: EtudiantComponent;
  let fixture: ComponentFixture<EtudiantComponent>;
  let service: EtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EtudiantComponent],
    })
      .overrideTemplate(EtudiantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtudiantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EtudiantService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.etudiants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
