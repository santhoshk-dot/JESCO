export interface JwtPayload {
  sub: string; // user._id
  email: string;
  role?: string; // optional role field
}
