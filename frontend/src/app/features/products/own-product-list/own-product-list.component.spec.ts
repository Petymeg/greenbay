import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnProductListComponent } from './own-product-list.component';

describe('OwnProductListComponent', () => {
  let component: OwnProductListComponent;
  let fixture: ComponentFixture<OwnProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
