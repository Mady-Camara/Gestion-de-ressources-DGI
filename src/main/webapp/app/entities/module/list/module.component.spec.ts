import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ModuleService } from '../service/module.service';

import { ModuleComponent } from './module.component';

describe('Module Management Component', () => {
  let comp: ModuleComponent;
  let fixture: ComponentFixture<ModuleComponent>;
  let service: ModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ModuleComponent],
    })
      .overrideTemplate(ModuleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModuleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ModuleService);

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
    expect(comp.modules?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
