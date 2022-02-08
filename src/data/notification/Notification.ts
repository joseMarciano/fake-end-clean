export interface Notification {
  send: (input: any) => Promise<void>
}
