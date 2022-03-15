import { FindFakeDataByIdRepository } from '../../../../data/protocols/fakeData/FindFakeDataByIdRepository'
import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { FindFakeDataById } from '../../../../domain/usecases/fakeData/find/FindFakeDataById'

export class DbFindFakeDataById implements FindFakeDataById {
  constructor (
    private readonly findFakeDataRepository: FindFakeDataByIdRepository
  ) {}

  async findById (id: string): Promise<FakeDataModel> {
    const fakeModel = await this.findFakeDataRepository.findById(id)
    return {
      id: fakeModel.id,
      ...fakeModel.content
    }
  }
}
