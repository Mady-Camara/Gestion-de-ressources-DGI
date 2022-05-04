import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbdenceComponent } from './abdence.component';

describe('AbdenceComponent', () => {
  let component: AbdenceComponent;
  let fixture: ComponentFixture<AbdenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbdenceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbdenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
