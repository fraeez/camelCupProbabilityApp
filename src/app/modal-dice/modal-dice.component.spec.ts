import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDiceComponent } from './modal-dice.component';

describe('ModalDiceComponent', () => {
  let component: ModalDiceComponent;
  let fixture: ComponentFixture<ModalDiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
