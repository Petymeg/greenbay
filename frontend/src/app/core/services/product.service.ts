import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subject, tap } from 'rxjs';
import { AddUserProductRequestViewModel } from 'src/app/shared/models/AddUserProductRequestViewModel';
import { AddUserProductViewModel } from 'src/app/shared/models/AddUserProductViewModel';
import { EditProductRequestViewModel } from 'src/app/shared/models/EditProductRequestViewModel';
import { ProductStatusTypes } from 'src/app/shared/models/enums/ProductStatusTypes';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';
import { UserProductViewModel } from 'src/app/shared/models/UserProductViewModel';
import { environment } from 'src/environments/environment';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private sellableItems = new Subject<ProductWithOwnerViewModel[]>();
  sellableItems$ = this.sellableItems.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBarService: SnackbarService
  ) {
    console.log('productService');
    this.getSellableItems();
  }

  getSellableItems(): void {
    this.http
      .get<ProductWithOwnerViewModel[]>(`${environment.apiUrl}/product`)
      .subscribe((x) => this.sellableItems.next(x));
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
          // this.userService.getMainInfo();
          this.snackBarService.showSuccessMessage('Purchase successful!');
        })
      );
  }

  getOwnProducts(): Observable<UserProductViewModel[]> {
    return this.http.get<UserProductViewModel[]>(
      `${environment.apiUrl}/user-info/products`
    );
  }

  editProduct(productDetails: EditProductRequestViewModel): Observable<void> {
    return this.http
      .put<void>(`${environment.apiUrl}/product`, productDetails)
      .pipe(
        tap(() => {
          this.snackBarService.showSuccessMessage('Update successful!');
        })
      );
  }

  setProductStatus(productId: number, statusCode: number): Observable<void> {
    return this.http
      .put<void>(`${environment.apiUrl}/product/setstatus`, {
        productId,
        statusCode,
      })
      .pipe(
        tap(() => {
          this.snackBarService.showSuccessMessage(
            `Status changed to ${ProductStatusTypes[statusCode]}!`
          );
        })
      );
  }
}
