import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClassRoom, ClassRoom } from '../class-room.model';
import { ClassRoomService } from '../service/class-room.service';
import { ISchedule } from 'app/entities/schedule/schedule.model';
import { ScheduleService } from 'app/entities/schedule/service/schedule.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';

@Component({
  selector: 'jhi-class-room-update',
  templateUrl: './class-room-update.component.html',
})
export class ClassRoomUpdateComponent implements OnInit {
  isSaving = false;

  schedulesSharedCollection: ISchedule[] = [];
  coursesSharedCollection: ICourse[] = [];

  editForm = this.fb.group({
    id: [],
    classroomName: [],
    schedule: [],
    course: [],
  });

  constructor(
    protected classRoomService: ClassRoomService,
    protected scheduleService: ScheduleService,
    protected courseService: CourseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ classRoom }) => {
      this.updateForm(classRoom);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const classRoom = this.createFromForm();
    if (classRoom.id !== undefined) {
      this.subscribeToSaveResponse(this.classRoomService.update(classRoom));
    } else {
      this.subscribeToSaveResponse(this.classRoomService.create(classRoom));
    }
  }

  trackScheduleById(index: number, item: ISchedule): number {
    return item.id!;
  }

  trackCourseById(index: number, item: ICourse): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClassRoom>>): void {
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

  protected updateForm(classRoom: IClassRoom): void {
    this.editForm.patchValue({
      id: classRoom.id,
      classroomName: classRoom.classroomName,
      schedule: classRoom.schedule,
      course: classRoom.course,
    });

    this.schedulesSharedCollection = this.scheduleService.addScheduleToCollectionIfMissing(
      this.schedulesSharedCollection,
      classRoom.schedule
    );
    this.coursesSharedCollection = this.courseService.addCourseToCollectionIfMissing(this.coursesSharedCollection, classRoom.course);
  }

  protected loadRelationshipsOptions(): void {
    this.scheduleService
      .query()
      .pipe(map((res: HttpResponse<ISchedule[]>) => res.body ?? []))
      .pipe(
        map((schedules: ISchedule[]) =>
          this.scheduleService.addScheduleToCollectionIfMissing(schedules, this.editForm.get('schedule')!.value)
        )
      )
      .subscribe((schedules: ISchedule[]) => (this.schedulesSharedCollection = schedules));

    this.courseService
      .query()
      .pipe(map((res: HttpResponse<ICourse[]>) => res.body ?? []))
      .pipe(map((courses: ICourse[]) => this.courseService.addCourseToCollectionIfMissing(courses, this.editForm.get('course')!.value)))
      .subscribe((courses: ICourse[]) => (this.coursesSharedCollection = courses));
  }

  protected createFromForm(): IClassRoom {
    return {
      ...new ClassRoom(),
      id: this.editForm.get(['id'])!.value,
      classroomName: this.editForm.get(['classroomName'])!.value,
      schedule: this.editForm.get(['schedule'])!.value,
      course: this.editForm.get(['course'])!.value,
    };
  }
}
