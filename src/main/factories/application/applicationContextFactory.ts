import { ApplicationContextImpl } from '../../../data/application/ApplicationContextImpl'
import { ApplicationContext } from '../../../data/protocols/application/ApplicationContext'

const makeApplicationContext = (): ApplicationContext => {
  return new ApplicationContextImpl()
}

const applicationContext = makeApplicationContext()

export { applicationContext }
