import { FakeData } from '../../../../domain/model/FakeData'

export interface AddFakeData {
  add: (data: any) => Promise<FakeData>
}
