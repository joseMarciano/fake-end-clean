import { FakeDataModel } from '../FakeDataModel'

export interface EditFakeData {
  edit: (data: FakeDataModel) => Promise<FakeDataModel>
}
