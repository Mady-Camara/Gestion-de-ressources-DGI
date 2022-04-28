import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClassRoomService } from '../service/class-room.service';
import { IClassRoom, ClassRoom } from '../class-room.model';
import { ISchedule } from 'app/entities/schedule/schedule.model';
import { ScheduleService } from 'app/entities/schedule/service/schedule.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

import { ClassRoomUpdateComponent } from './class-room-update.component';

describe('ClassRoom Management Update Component', () => {
  let comp: ClassRoomUpdateComponent;
  let fixture: ComponentFixture<ClassRoomUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let classRoomService: ClassRoomService;
  let scheduleService: ScheduleService;
  let courseService: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClassRoomUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ClassRoomUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClassRoomUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    classRoomService = TestBed.inject(ClassRoomService);
    scheduleService = TestBed.inject(ScheduleService);
    courseService = TestBed.inject(CourseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Schedule query and add missing value', () => {
      const classRoom: IClassRoom = { id: 456 };
      const schedule: ISchedule = { id: 46210 };
      classRoom.schedule = schedule;

      const scheduleCollection: ISchedule[] = [{ id: 48848 }];
      jest.spyOn(scheduleService, 'query').mockReturnValue(of(new HttpResponse({ body: scheduleCollection })));
      const additionalSchedules = [schedule];
      const expectedCollection: ISchedule[] = [...additionalSchedules, ...scheduleCollection];
      jest.spyOn(scheduleService, 'addScheduleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ classRoom });
      comp.ngOnInit();

      expect(scheduleService.query).toHaveBeenCalled();
      expect(scheduleService.addScheduleToCollectionIfMissing).toHaveBeenCalledWith(scheduleCollection, ...additionalSchedules);
      expect(comp.schedulesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Course query and add missing value', () => {
      const classRoom: IClassRoom = { id: 456 };
      const course: ICourse = { id: 40902 };
      classRoom.course = course;

      const courseCollection: ICourse[] = [{ id: 59081 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [course];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ classRoom });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(courseCollection, ...additionalCourses);
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const classRoom: IClassRoom = { id: 456 };
      const schedule: ISchedule = { id: 84880 };
      classRoom.schedule = schedule;
      const course: ICourse = { id: 20155 };
      classRoom.course = course;

      activatedRoute.data = of({ classRoom });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(classRoom));
      expect(comp.schedulesSharedCollection).toContain(schedule);
      expect(comp.coursesSharedCollection).toContain(course);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClassRoom>>();
      const classRoom = { id: 123 };
      jest.spyOn(classRoomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classRoom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classRoom }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(classRoomService.update).toHaveBeenCalledWith(classRoom);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClassRoom>>();
      const classRoom = new ClassRoom();
      jest.spyOn(classRoomService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classRoom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classRoom }));
      saveSubject.complete();

      // THEN
      expect(classRoomService.create).toHaveBeenCalledWith(classRoom);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClassRoom>>();
      const classRoom = { id: 123 };
      jest.spyOn(classRoomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classRoom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(classRoomService.update).toHaveBeenCalledWith(classRoom);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackScheduleById', () => {
      it('Should return tracked Schedule primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackScheduleById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCourseById', () => {
      it('Should return tracked Course primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCourseById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
