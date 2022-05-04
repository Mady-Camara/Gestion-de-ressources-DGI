import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'schedule',
        data: { pageTitle: 'Schedules' },
        loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
      },
      {
        path: 'course',
        data: { pageTitle: 'Courses' },
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      },
      {
        path: 'class-room',
        data: { pageTitle: 'ClassRooms' },
        loadChildren: () => import('./class-room/class-room.module').then(m => m.ClassRoomModule),
      },
      {
        path: 'module',
        data: { pageTitle: 'Modules' },
        loadChildren: () => import('./module/module.module').then(m => m.ModuleModule),
      },
      {
        path: 'etudiant',
        data: { pageTitle: 'Etudiants' },
        loadChildren: () => import('./etudiant/etudiant.module').then(m => m.EtudiantModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
