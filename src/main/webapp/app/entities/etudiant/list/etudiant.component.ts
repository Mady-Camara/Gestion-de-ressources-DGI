import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';
import { EtudiantDeleteDialogComponent } from '../delete/etudiant-delete-dialog.component';

@Component({
  selector: 'jhi-etudiant',
  templateUrl: './etudiant.component.html',
})
export class EtudiantComponent implements OnInit {
  etudiants?: IEtudiant[];
  isLoading = false;

  constructor(protected etudiantService: EtudiantService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.etudiantService.query().subscribe({
      next: (res: HttpResponse<IEtudiant[]>) => {
        this.isLoading = false;
        this.etudiants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEtudiant): number {
    return item.id!;
  }

  delete(etudiant: IEtudiant): void {
    const modalRef = this.modalService.open(EtudiantDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.etudiant = etudiant;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
