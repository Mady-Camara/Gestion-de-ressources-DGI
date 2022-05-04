import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEtudiant, Etudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IClassRoom } from 'app/entities/class-room/class-room.model';
import { ClassRoomService } from 'app/entities/class-room/service/class-room.service';

@Component({
  selector: 'jhi-etudiant-update',
  templateUrl: './etudiant-update.component.html',
})
export class EtudiantUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  classRoomsSharedCollection: IClassRoom[] = [];

  editForm = this.fb.group({
    id: [],
    numeroEtudiant: [],
    prenom: [],
    nom: [],
    email: [],
    telephone: [],
    user: [],
    classRoom: [],
  });

  constructor(
    protected etudiantService: EtudiantService,
    protected userService: UserService,
    protected classRoomService: ClassRoomService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etudiant }) => {
      this.updateForm(etudiant);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etudiant = this.createFromForm();
    if (etudiant.id !== undefined) {
      this.subscribeToSaveResponse(this.etudiantService.update(etudiant));
    } else {
      this.subscribeToSaveResponse(this.etudiantService.create(etudiant));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackClassRoomById(index: number, item: IClassRoom): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtudiant>>): void {
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

  protected updateForm(etudiant: IEtudiant): void {
    this.editForm.patchValue({
      id: etudiant.id,
      numeroEtudiant: etudiant.numeroEtudiant,
      prenom: etudiant.prenom,
      nom: etudiant.nom,
      email: etudiant.email,
      telephone: etudiant.telephone,
      user: etudiant.user,
      classRoom: etudiant.classRoom,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, etudiant.user);
    this.classRoomsSharedCollection = this.classRoomService.addClassRoomToCollectionIfMissing(
      this.classRoomsSharedCollection,
      etudiant.classRoom
    );
  }

  protected loadRelationshipsOptions(): void {
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
          this.classRoomService.addClassRoomToCollectionIfMissing(classRooms, this.editForm.get('classRoom')!.value)
        )
      )
      .subscribe((classRooms: IClassRoom[]) => (this.classRoomsSharedCollection = classRooms));
  }

  protected createFromForm(): IEtudiant {
    return {
      ...new Etudiant(),
      id: this.editForm.get(['id'])!.value,
      numeroEtudiant: this.editForm.get(['numeroEtudiant'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      email: this.editForm.get(['email'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      user: this.editForm.get(['user'])!.value,
      classRoom: this.editForm.get(['classRoom'])!.value,
    };
  }
}
