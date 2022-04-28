import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ClassRoomService } from '../service/class-room.service';

import { ClassRoomComponent } from './class-room.component';

describe('ClassRoom Management Component', () => {
  let comp: ClassRoomComponent;
  let fixture: ComponentFixture<ClassRoomComponent>;
  let service: ClassRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClassRoomComponent],
    })
      .overrideTemplate(ClassRoomComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClassRoomComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClassRoomService);

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
    expect(comp.classRooms?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
