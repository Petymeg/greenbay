import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AddUserProductRequestViewModel } from 'src/app/shared/models/AddUserProductRequestViewModel';
import { AddUserProductViewModel } from 'src/app/shared/models/AddUserProductViewModel';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';
import { UserProductViewModel } from 'src/app/shared/models/UserProductViewModel';
import { environment } from 'src/environments/environment';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

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

  buyProduct(productId: number): Observable<void> {
    return this.http
      .put<void>(`${environment.apiUrl}/product/buy`, {
        productId,
      })
      .pipe(
        tap(() => {
          this.snackBarService.showSuccessMessage('Purchase successful!');
        })
      );
  }

  getOwnProducts(): Observable<UserProductViewModel[]> {
    return this.http.get<UserProductViewModel[]>(
      `${environment.apiUrl}/user-info/products`
    );
  }
}
