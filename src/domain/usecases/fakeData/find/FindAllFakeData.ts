import { FakeDataModel } from '../FakeDataModel'

export interface FindAllFakeData {
  findAll: () => Promise<FakeDataModel[]>
}
