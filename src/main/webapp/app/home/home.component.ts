import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ICourse } from '../entities/course/course.model';
import { CourseService } from '../entities/course/service/course.service';
import { ModuleService } from '../entities/module/service/module.service';
import { IModule } from '../entities/module/module.model';
import { UserService } from '../entities/user/user.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  courses: ICourse[] | null = [];
  modules: IModule[] | null = [];
  message = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private courseService: CourseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    /*this.courseService.query().subscribe(
      (res)=>{
        this.courses = res.body;
      }
    )*/

    this.userService.findCurrentUserCourse().subscribe(
      res => {
        this.courses = res.body;
      },
      err => {
        //Message erreur
      }
    );
  }

  login(): void {
    this.router.navigate(['/login']);
    this.courseService.findUserCourses().subscribe(
      res => {
        this.courses = res.body;
      },
      err => {
        //Message erreur
        this.message = 'Pas de projet trouve';
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
