import { Component, OnInit } from '@angular/core';
import { ICourse } from '../entities/course/course.model';
import { CourseService } from '../entities/course/service/course.service';

@Component({
  selector: 'jhi-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  ok = false;
  courses: ICourse[] | null = [];
  cours: ICourse | null | undefined;
  lundi: ICourse[] | null = [];
  mardi: ICourse[] | null = [];
  mercredi: ICourse[] | null = [];
  jeudi: ICourse[] | null = [];
  vendredi: ICourse[] | null = [];
  samedi: ICourse[] | null = [];

  constructor(private courseService: CourseService) {
    this.courseService = courseService;
  }

  ngOnInit(): void {
    this.ok = true;
    this.courseService.findCoursOfWeek().subscribe(
      res => {
        this.courses = res.body;
        if (this.courses != null) {
          for (this.cours of this.courses) {
            if (this.cours.libelleJour === 'lundi') {
              this.lundi?.push(this.cours);
            } else if (this.cours.libelleJour === 'mardi') {
              this.mardi?.push(this.cours);
            } else if (this.cours.libelleJour === 'mercredi') {
              this.mercredi?.push(this.cours);
            } else if (this.cours.libelleJour === 'jeudi') {
              this.jeudi?.push(this.cours);
            } else if (this.cours.libelleJour === 'vendredi') {
              this.vendredi?.push(this.cours);
            } else if (this.cours.libelleJour === 'samedi') {
              this.samedi?.push(this.cours);
            }
          }
        }
        console.log(res.body);
      },

      err => {
        //Message erreur
      }
    );
  }
}
