import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtudiantService } from '../service/etudiant.service';
import { IEtudiant, Etudiant } from '../etudiant.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IClassRoom } from 'app/entities/class-room/class-room.model';
import { ClassRoomService } from 'app/entities/class-room/service/class-room.service';

import { EtudiantUpdateComponent } from './etudiant-update.component';

describe('Etudiant Management Update Component', () => {
  let comp: EtudiantUpdateComponent;
  let fixture: ComponentFixture<EtudiantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etudiantService: EtudiantService;
  let userService: UserService;
  let classRoomService: ClassRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtudiantUpdateComponent],
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
      .overrideTemplate(EtudiantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtudiantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etudiantService = TestBed.inject(EtudiantService);
    userService = TestBed.inject(UserService);
    classRoomService = TestBed.inject(ClassRoomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const etudiant: IEtudiant = { id: 456 };
      const user: IUser = { id: 30516 };
      etudiant.user = user;

      const userCollection: IUser[] = [{ id: 35896 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ClassRoom query and add missing value', () => {
      const etudiant: IEtudiant = { id: 456 };
      const classRoom: IClassRoom = { id: 46968 };
      etudiant.classRoom = classRoom;

      const classRoomCollection: IClassRoom[] = [{ id: 46106 }];
      jest.spyOn(classRoomService, 'query').mockReturnValue(of(new HttpResponse({ body: classRoomCollection })));
      const additionalClassRooms = [classRoom];
      const expectedCollection: IClassRoom[] = [...additionalClassRooms, ...classRoomCollection];
      jest.spyOn(classRoomService, 'addClassRoomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(classRoomService.query).toHaveBeenCalled();
      expect(classRoomService.addClassRoomToCollectionIfMissing).toHaveBeenCalledWith(classRoomCollection, ...additionalClassRooms);
      expect(comp.classRoomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etudiant: IEtudiant = { id: 456 };
      const user: IUser = { id: 20210 };
      etudiant.user = user;
      const classRoom: IClassRoom = { id: 12499 };
      etudiant.classRoom = classRoom;

      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(etudiant));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.classRoomsSharedCollection).toContain(classRoom);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etudiant>>();
      const etudiant = { id: 123 };
      jest.spyOn(etudiantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etudiant }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(etudiantService.update).toHaveBeenCalledWith(etudiant);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etudiant>>();
      const etudiant = new Etudiant();
      jest.spyOn(etudiantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etudiant }));
      saveSubject.complete();

      // THEN
      expect(etudiantService.create).toHaveBeenCalledWith(etudiant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etudiant>>();
      const etudiant = { id: 123 };
      jest.spyOn(etudiantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etudiantService.update).toHaveBeenCalledWith(etudiant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackClassRoomById', () => {
      it('Should return tracked ClassRoom primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClassRoomById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
