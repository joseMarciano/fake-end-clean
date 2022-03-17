export interface LogOutUser {
  logout: (token: string) => Promise<void>
}
