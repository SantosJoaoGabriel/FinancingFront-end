import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ganhos } from './ganhos';

describe('Ganhos', () => {
  let component: Ganhos;
  let fixture: ComponentFixture<Ganhos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ganhos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ganhos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
