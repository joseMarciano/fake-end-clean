import { FakeData } from '../../../domain/model/FakeData'
import { FakeDataModel } from '../../../domain/usecases/fakeData/FakeDataModel'

export interface EditFakeDataRepository {
  edit: (data: FakeDataModel) => Promise<FakeData>
}
