import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IModule } from '../module.model';
import { ModuleService } from '../service/module.service';

@Component({
  templateUrl: './module-delete-dialog.component.html',
})
export class ModuleDeleteDialogComponent {
  module?: IModule;

  constructor(protected moduleService: ModuleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.moduleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
