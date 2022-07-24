export interface JwtTokenPayloadModel {
  userId: number;
  username: string;
  roleId: number;
  iat: number;
  exp: number;
}
