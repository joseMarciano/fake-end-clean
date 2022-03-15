import { FakeDataModel } from '../FakeDataModel'

export interface FindFakeDataById {
  findById: (id: string) => Promise<FakeDataModel>
}
