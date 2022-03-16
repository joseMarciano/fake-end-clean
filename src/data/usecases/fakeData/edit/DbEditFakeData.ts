import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { EditFakeDataRepository } from '../../../../data/protocols/fakeData/EditFakeDataRepository'
import { EditFakeData } from '../../../../domain/usecases/fakeData/edit/EditFakeData'

export class DbEditFakeData implements EditFakeData {
  constructor (
    private readonly editFakeDataRepository: EditFakeDataRepository
  ) {}

  async edit (data: FakeDataModel): Promise<FakeDataModel> {
    const fakeModel = await this.editFakeDataRepository.edit(data)

    if (!fakeModel) return null as any

    return {
      id: fakeModel.id,
      ...fakeModel.content
    }
  }
}
