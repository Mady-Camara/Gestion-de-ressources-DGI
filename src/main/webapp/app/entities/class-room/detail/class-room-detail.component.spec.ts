import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClassRoomDetailComponent } from './class-room-detail.component';

describe('ClassRoom Management Detail Component', () => {
  let comp: ClassRoomDetailComponent;
  let fixture: ComponentFixture<ClassRoomDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassRoomDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ classRoom: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClassRoomDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClassRoomDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load classRoom on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.classRoom).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
