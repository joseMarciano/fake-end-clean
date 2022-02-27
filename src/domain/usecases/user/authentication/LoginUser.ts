import { LoginUserError } from '../validations/LoginUserError'

export interface LoginUser {
  login: (userLoginModel: LoginUserModel) => Promise<AccessToken | LoginUserError>
}

export interface AccessToken {
  accessToken: string
  refreshToken: string
}

export interface LoginUserModel {
  email: string
  password: string
}
