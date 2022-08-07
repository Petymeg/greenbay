import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getSellableItems(): Observable<ProductWithOwnerViewModel[]> {
    return this.http.get<ProductWithOwnerViewModel[]>(
      `${environment.apiUrl}/product`
    );
  }
}
