export interface ILoginBody {
  login: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}
