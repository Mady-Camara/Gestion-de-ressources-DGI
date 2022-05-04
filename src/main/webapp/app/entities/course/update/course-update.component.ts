import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICourse, Course } from '../course.model';
import { CourseService } from '../service/course.service';
import { IModule } from 'app/entities/module/module.model';
import { ModuleService } from 'app/entities/module/service/module.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IClassRoom } from 'app/entities/class-room/class-room.model';
import { ClassRoomService } from 'app/entities/class-room/service/class-room.service';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
})
export class CourseUpdateComponent implements OnInit {
  isSaving = false;

  modulesSharedCollection: IModule[] = [];
  usersSharedCollection: IUser[] = [];
  classRoomsSharedCollection: IClassRoom[] = [];

  editForm = this.fb.group({
    id: [],
    courseName: [],
    pointer: [],
    jour: [],
    volumeHoraire: [],
    salle: [],
    heureDeDebut: [null, [Validators.required]],
    heureDeFin: [null, [Validators.required]],
    libelleJour: [],
    module: [],
    user: [],
    classe: [],
  });

  constructor(
    protected courseService: CourseService,
    protected moduleService: ModuleService,
    protected userService: UserService,
    protected classRoomService: ClassRoomService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.updateForm(course);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const course = this.createFromForm();
    if (course.id !== undefined) {
      this.subscribeToSaveResponse(this.courseService.update(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(course));
    }
  }

  trackModuleById(index: number, item: IModule): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackClassRoomById(index: number, item: IClassRoom): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(course: ICourse): void {
    this.editForm.patchValue({
      id: course.id,
      courseName: course.courseName,
      pointer: course.pointer,
      jour: course.jour,
      volumeHoraire: course.volumeHoraire,
      salle: course.salle,
      heureDeDebut: course.heureDeDebut,
      heureDeFin: course.heureDeFin,
      libelleJour: course.libelleJour,
      module: course.module,
      user: course.user,
      classe: course.classe,
    });

    this.modulesSharedCollection = this.moduleService.addModuleToCollectionIfMissing(this.modulesSharedCollection, course.module);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, course.user);
    this.classRoomsSharedCollection = this.classRoomService.addClassRoomToCollectionIfMissing(
      this.classRoomsSharedCollection,
      course.classe
    );
  }

  protected loadRelationshipsOptions(): void {
    this.moduleService
      .query()
      .pipe(map((res: HttpResponse<IModule[]>) => res.body ?? []))
      .pipe(map((modules: IModule[]) => this.moduleService.addModuleToCollectionIfMissing(modules, this.editForm.get('module')!.value)))
      .subscribe((modules: IModule[]) => (this.modulesSharedCollection = modules));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.classRoomService
      .query()
      .pipe(map((res: HttpResponse<IClassRoom[]>) => res.body ?? []))
      .pipe(
        map((classRooms: IClassRoom[]) =>
          this.classRoomService.addClassRoomToCollectionIfMissing(classRooms, this.editForm.get('classe')!.value)
        )
      )
      .subscribe((classRooms: IClassRoom[]) => (this.classRoomsSharedCollection = classRooms));
  }

  protected createFromForm(): ICourse {
    return {
      ...new Course(),
      id: this.editForm.get(['id'])!.value,
      courseName: this.editForm.get(['courseName'])!.value,
      pointer: this.editForm.get(['pointer'])!.value,
      jour: this.editForm.get(['jour'])!.value,
      volumeHoraire: this.editForm.get(['volumeHoraire'])!.value,
      salle: this.editForm.get(['salle'])!.value,
      heureDeDebut: this.editForm.get(['heureDeDebut'])!.value,
      heureDeFin: this.editForm.get(['heureDeFin'])!.value,
      libelleJour: this.editForm.get(['libelleJour'])!.value,
      module: this.editForm.get(['module'])!.value,
      user: this.editForm.get(['user'])!.value,
      classe: this.editForm.get(['classe'])!.value,
    };
  }
}
