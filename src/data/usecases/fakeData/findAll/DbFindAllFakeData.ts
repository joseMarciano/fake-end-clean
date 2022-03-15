import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { FindAllFakeData } from '../../../../domain/usecases/fakeData/find/FindAllFakeData'
import { FakeData } from '../../../../domain/model/FakeData'
import { FindAllFakeDataRepository } from '../../../../data/protocols/fakeData/FindAllFakeDataRepository'

export class DbFindAllFakeData implements FindAllFakeData {
  constructor (
    private readonly findAllFakeDataRepository: FindAllFakeDataRepository
  ) {}

  async findAll (): Promise<FakeDataModel[]> {
    const fakeModel = await this.findAllFakeDataRepository.findAll()
    return fakeModel.map((model: FakeData) => ({ id: model.id, ...model.content }))
  }
}
