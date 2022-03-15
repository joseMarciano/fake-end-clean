import { FakeDataModel } from '../FakeDataModel'

export interface AddFakeData {
  add: (data: any) => Promise<FakeDataModel>
}
