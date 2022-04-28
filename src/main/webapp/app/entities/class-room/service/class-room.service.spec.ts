import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClassRoom, ClassRoom } from '../class-room.model';

import { ClassRoomService } from './class-room.service';

describe('ClassRoom Service', () => {
  let service: ClassRoomService;
  let httpMock: HttpTestingController;
  let elemDefault: IClassRoom;
  let expectedResult: IClassRoom | IClassRoom[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClassRoomService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      classroomName: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ClassRoom', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ClassRoom()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClassRoom', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          classroomName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClassRoom', () => {
      const patchObject = Object.assign(
        {
          classroomName: 'BBBBBB',
        },
        new ClassRoom()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClassRoom', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          classroomName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ClassRoom', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addClassRoomToCollectionIfMissing', () => {
      it('should add a ClassRoom to an empty array', () => {
        const classRoom: IClassRoom = { id: 123 };
        expectedResult = service.addClassRoomToCollectionIfMissing([], classRoom);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(classRoom);
      });

      it('should not add a ClassRoom to an array that contains it', () => {
        const classRoom: IClassRoom = { id: 123 };
        const classRoomCollection: IClassRoom[] = [
          {
            ...classRoom,
          },
          { id: 456 },
        ];
        expectedResult = service.addClassRoomToCollectionIfMissing(classRoomCollection, classRoom);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClassRoom to an array that doesn't contain it", () => {
        const classRoom: IClassRoom = { id: 123 };
        const classRoomCollection: IClassRoom[] = [{ id: 456 }];
        expectedResult = service.addClassRoomToCollectionIfMissing(classRoomCollection, classRoom);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(classRoom);
      });

      it('should add only unique ClassRoom to an array', () => {
        const classRoomArray: IClassRoom[] = [{ id: 123 }, { id: 456 }, { id: 99410 }];
        const classRoomCollection: IClassRoom[] = [{ id: 123 }];
        expectedResult = service.addClassRoomToCollectionIfMissing(classRoomCollection, ...classRoomArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const classRoom: IClassRoom = { id: 123 };
        const classRoom2: IClassRoom = { id: 456 };
        expectedResult = service.addClassRoomToCollectionIfMissing([], classRoom, classRoom2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(classRoom);
        expect(expectedResult).toContain(classRoom2);
      });

      it('should accept null and undefined values', () => {
        const classRoom: IClassRoom = { id: 123 };
        expectedResult = service.addClassRoomToCollectionIfMissing([], null, classRoom, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(classRoom);
      });

      it('should return initial array if no ClassRoom is added', () => {
        const classRoomCollection: IClassRoom[] = [{ id: 123 }];
        expectedResult = service.addClassRoomToCollectionIfMissing(classRoomCollection, undefined, null);
        expect(expectedResult).toEqual(classRoomCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
