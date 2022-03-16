import { ApplicationContextFakeImpl } from '../../../data/application/fakeData/ApplicationContextFakeImpl'

const fakeApplicationContextFactory = (): ApplicationContextFakeImpl => {
  return new ApplicationContextFakeImpl()
}

const fakeApplicationContext = fakeApplicationContextFactory()

export { fakeApplicationContext }
