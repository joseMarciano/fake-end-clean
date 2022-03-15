import { FakeData } from '../../../domain/model/FakeData'

export interface FindFakeDataByIdRepository {
  findById: (id: string) => Promise<FakeData>
}
