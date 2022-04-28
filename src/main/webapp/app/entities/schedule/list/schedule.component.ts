import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISchedule } from '../schedule.model';
import { ScheduleService } from '../service/schedule.service';
import { ScheduleDeleteDialogComponent } from '../delete/schedule-delete-dialog.component';

@Component({
  selector: 'jhi-schedule',
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent implements OnInit {
  schedules?: ISchedule[];
  isLoading = false;

  constructor(protected scheduleService: ScheduleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.scheduleService.query().subscribe({
      next: (res: HttpResponse<ISchedule[]>) => {
        this.isLoading = false;
        this.schedules = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISchedule): number {
    return item.id!;
  }

  delete(schedule: ISchedule): void {
    const modalRef = this.modalService.open(ScheduleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.schedule = schedule;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
