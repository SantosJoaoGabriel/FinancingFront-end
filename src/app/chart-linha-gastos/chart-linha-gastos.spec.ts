import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLinhaGastos } from './chart-linha-gastos';

describe('ChartLinhaGastos', () => {
  let component: ChartLinhaGastos;
  let fixture: ComponentFixture<ChartLinhaGastos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartLinhaGastos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartLinhaGastos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
