
export interface ActivateUserByEmail {
  activeByEmail: (email: string) => Promise<void>
}
