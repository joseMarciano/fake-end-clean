export interface Authentication {
  auth: (authenticationMode: AuthenticationModel) => Promise<string>
}

export interface AuthenticationModel {
  id: string
  email: string
  password: string
}
