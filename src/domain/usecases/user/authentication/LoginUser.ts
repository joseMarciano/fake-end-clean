export interface LoginUser {
  login: (userLoginModel: LoginUserModel) => Promise<AccessToken>
}

export interface AccessToken {
  accessToken: string
  refreshToken: string
}

export interface LoginUserModel {
  email: string
  password: string
}
