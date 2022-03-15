import { DeleteFakeDataByIdRepository } from '../../../../data/protocols/fakeData/DeleteFakeDataByIdRepository'
import { DeleteFakeDataById } from '../../../../domain/usecases/fakeData/remove/DeleteFakeDataById'

export class DbDeleteFakeDataById implements DeleteFakeDataById {
  constructor (
    private readonly deleteFakeData: DeleteFakeDataByIdRepository
  ) {}

  async deleteById (id: string): Promise<void> {
    await this.deleteFakeData.deleteById(id)
  }
}
