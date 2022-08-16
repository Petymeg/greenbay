import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnProductCategoryListComponent } from './own-product-category-list.component';

describe('OwnProductCategoryListComponent', () => {
  let component: OwnProductCategoryListComponent;
  let fixture: ComponentFixture<OwnProductCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnProductCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnProductCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
