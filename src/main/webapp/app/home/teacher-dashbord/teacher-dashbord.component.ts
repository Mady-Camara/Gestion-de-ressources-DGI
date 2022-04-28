import { Component, OnInit } from '@angular/core';
import { UserService } from '../../entities/user/user.service';

import { FormControl } from '@angular/forms';
import { IUser } from '../../entities/user/user.model';

@Component({
  selector: 'jhi-teacher-dashbord',
  templateUrl: './teacher-dashbord.component.html',
  styleUrls: ['./teacher-dashbord.component.scss'],
})
export class TeacherDashbordComponent implements OnInit {
  search = new FormControl();
  user: IUser | null = null;
  state = false;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.state = false;
  }

  rechercher(): void {
    this.userService.findEtudiant(this.search.value).subscribe(
      res => {
        this.user = res.body;
      },
      err => {
        this.user = null;
      }
    );
  }
}
