import { User } from 'src/domain/model/User'
import { ApplicationContext } from '../protocols/application/ApplicationContext'

export class ApplicationContextImpl implements ApplicationContext {
  private user: User

  async setUser (user: User): Promise<void> {
    this.user = user
  }

  async getUser (): Promise<User> {
    if (!this.user) throw new Error('Fail on load ApplicationContext')
    return this.user
  }
}
