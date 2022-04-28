import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IModule } from '../module.model';
import { ModuleService } from '../service/module.service';
import { ModuleDeleteDialogComponent } from '../delete/module-delete-dialog.component';

@Component({
  selector: 'jhi-module',
  templateUrl: './module.component.html',
})
export class ModuleComponent implements OnInit {
  modules?: IModule[];
  isLoading = false;

  constructor(protected moduleService: ModuleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.moduleService.query().subscribe({
      next: (res: HttpResponse<IModule[]>) => {
        this.isLoading = false;
        this.modules = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IModule): number {
    return item.id!;
  }

  delete(module: IModule): void {
    const modalRef = this.modalService.open(ModuleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.module = module;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
