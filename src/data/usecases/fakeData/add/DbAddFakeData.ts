import { AddFakeDataRepository } from '../../../../data/protocols/fakeData/AddFakeDataRepository'
import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { AddFakeData } from '../../../../domain/usecases/fakeData/add/AddFakeData'

export class DbAddFakeDataa implements AddFakeData {
  constructor (
    private readonly addFakeDataRepository: AddFakeDataRepository
  ) {}

  async add (data: any): Promise<FakeDataModel> {
    await this.addFakeDataRepository.add(data)
    return null as any
  }
}
