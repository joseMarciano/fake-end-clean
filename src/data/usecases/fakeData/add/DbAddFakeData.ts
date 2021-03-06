import { AddFakeDataRepository } from '../../../../data/protocols/fakeData/AddFakeDataRepository'
import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { AddFakeData } from '../../../../domain/usecases/fakeData/add/AddFakeData'

export class DbAddFakeDataa implements AddFakeData {
  constructor (
    private readonly addFakeDataRepository: AddFakeDataRepository
  ) {}

  async add (data: any): Promise<FakeDataModel> {
    const fakeModel = await this.addFakeDataRepository.add(data)
    return {
      id: fakeModel.id,
      ...fakeModel.content
    }
  }
}
