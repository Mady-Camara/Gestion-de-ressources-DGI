import { Component, OnInit } from '@angular/core';
import { IEtudiant } from '../entities/etudiant/etudiant.model';
import { EtudiantService } from '../entities/etudiant/service/etudiant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-abdence',
  templateUrl: './abdence.component.html',
  styleUrls: ['./abdence.component.scss'],
})
export class AbdenceComponent implements OnInit {
  etudiants?: IEtudiant[] | null;
  isLoading = false;
  classe: string | null = '';
  constructor(protected etudiantService: EtudiantService, protected modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.classe = sessionStorage.getItem('classe');
    console.log(this.classe);
    if (this.classe !== null) {
      this.etudiantService.findByClasse(this.classe).subscribe(
        res => {
          this.isLoading = false;
          this.etudiants = res.body;
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }
}
