import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnProductItemComponent } from './own-product-item.component';

describe('OwnProductItemComponent', () => {
  let component: OwnProductItemComponent;
  let fixture: ComponentFixture<OwnProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnProductItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
