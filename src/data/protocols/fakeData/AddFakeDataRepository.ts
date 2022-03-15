import { FakeData } from '../../../domain/model/FakeData'

export interface AddFakeDataRepository {
  add: (data: any) => Promise<FakeData>
}
