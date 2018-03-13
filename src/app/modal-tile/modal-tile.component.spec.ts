import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTileComponent } from './modal-tile.component';

describe('ModalTileComponent', () => {
  let component: ModalTileComponent;
  let fixture: ComponentFixture<ModalTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
