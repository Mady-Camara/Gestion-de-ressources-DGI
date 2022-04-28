import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDashbordComponent } from './teacher-dashbord.component';

describe('TeacherDashbordComponent', () => {
  let component: TeacherDashbordComponent;
  let fixture: ComponentFixture<TeacherDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherDashbordComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
