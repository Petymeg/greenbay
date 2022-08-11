import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AddUserProductRequestViewModel } from 'src/app/shared/models/AddUserProductRequestViewModel';
import { AddUserProductViewModel } from 'src/app/shared/models/AddUserProductViewModel';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private router: Router) {}

  getSellableItems(): Observable<ProductWithOwnerViewModel[]> {
    return this.http.get<ProductWithOwnerViewModel[]>(
      `${environment.apiUrl}/product`
    );
  }

  getProductDetails(productId: number): Observable<ProductWithOwnerViewModel> {
    return this.http.get<ProductWithOwnerViewModel>(
      `${environment.apiUrl}/product/${productId}`
    );
  }

  addProduct(productDetails: AddUserProductRequestViewModel): Observable<void> {
    return this.http
      .post<AddUserProductViewModel>(
        `${environment.apiUrl}/product`,
        productDetails
      )
      .pipe(
        tap((x) => {
          this.router.navigate([`/products/view`, x.productId]);
        }),
        map(() => undefined)
      );
  }
}
