import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IModule, Module } from '../module.model';

import { ModuleService } from './module.service';

describe('Module Service', () => {
  let service: ModuleService;
  let httpMock: HttpTestingController;
  let elemDefault: IModule;
  let expectedResult: IModule | IModule[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ModuleService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      moduleName: 'AAAAAAA',
      desccription: 'AAAAAAA',
      hourNumber: 0,
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

    it('should create a Module', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Module()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Module', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          moduleName: 'BBBBBB',
          desccription: 'BBBBBB',
          hourNumber: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Module', () => {
      const patchObject = Object.assign(
        {
          moduleName: 'BBBBBB',
          desccription: 'BBBBBB',
          hourNumber: 1,
        },
        new Module()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Module', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          moduleName: 'BBBBBB',
          desccription: 'BBBBBB',
          hourNumber: 1,
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

    it('should delete a Module', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addModuleToCollectionIfMissing', () => {
      it('should add a Module to an empty array', () => {
        const module: IModule = { id: 123 };
        expectedResult = service.addModuleToCollectionIfMissing([], module);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(module);
      });

      it('should not add a Module to an array that contains it', () => {
        const module: IModule = { id: 123 };
        const moduleCollection: IModule[] = [
          {
            ...module,
          },
          { id: 456 },
        ];
        expectedResult = service.addModuleToCollectionIfMissing(moduleCollection, module);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Module to an array that doesn't contain it", () => {
        const module: IModule = { id: 123 };
        const moduleCollection: IModule[] = [{ id: 456 }];
        expectedResult = service.addModuleToCollectionIfMissing(moduleCollection, module);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(module);
      });

      it('should add only unique Module to an array', () => {
        const moduleArray: IModule[] = [{ id: 123 }, { id: 456 }, { id: 44882 }];
        const moduleCollection: IModule[] = [{ id: 123 }];
        expectedResult = service.addModuleToCollectionIfMissing(moduleCollection, ...moduleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const module: IModule = { id: 123 };
        const module2: IModule = { id: 456 };
        expectedResult = service.addModuleToCollectionIfMissing([], module, module2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(module);
        expect(expectedResult).toContain(module2);
      });

      it('should accept null and undefined values', () => {
        const module: IModule = { id: 123 };
        expectedResult = service.addModuleToCollectionIfMissing([], null, module, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(module);
      });

      it('should return initial array if no Module is added', () => {
        const moduleCollection: IModule[] = [{ id: 123 }];
        expectedResult = service.addModuleToCollectionIfMissing(moduleCollection, undefined, null);
        expect(expectedResult).toEqual(moduleCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
