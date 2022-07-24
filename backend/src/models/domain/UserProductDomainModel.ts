export interface UserProductDomainModel {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  price: number;
  active: boolean;
  userId: number;
}
