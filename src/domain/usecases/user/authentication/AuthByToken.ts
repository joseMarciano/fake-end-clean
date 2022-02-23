export interface AuthByToken {
  authByToken: (token: string) => Promise<boolean>
}
