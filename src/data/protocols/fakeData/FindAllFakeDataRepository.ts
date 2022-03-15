import { FakeDataModel } from '../../../domain/usecases/fakeData/FakeDataModel'

export interface FindAllFakeDataRepository {
  findAll: () => Promise<FakeDataModel[]>
}
