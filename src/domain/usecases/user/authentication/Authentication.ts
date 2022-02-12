export interface Authentication {
  auth: (authenticationMode: AuthenticationModel) => Promise<string>
}

export interface AuthenticationModel {
  email: string
  password: string
}
