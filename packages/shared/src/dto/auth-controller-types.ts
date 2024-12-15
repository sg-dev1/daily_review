export interface UserLoginDtoType {
  username: string;
  password: string;
}

export interface RegisterRequestDtoType {
  username: string;
  password: string;
  email: string;
}

export interface JwtPayloadDtoType {
  username: string;

  iat?: number;
  exp?: number;
}
