import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGastos } from './chart-gastos';

describe('ChartGastos', () => {
  let component: ChartGastos;
  let fixture: ComponentFixture<ChartGastos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartGastos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartGastos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
