import { Pageable, Page } from '../../../../domain/usecases/commons/Page'
import { PageFakeData } from '../../../../domain/usecases/fakeData/find/PageFakeData'
import { FakeDataModel } from '../../../../domain/usecases/fakeData/FakeDataModel'
import { PageFakeDataRepository } from '../../../../data/protocols/fakeData/PageFakeDataRepository'

export class DbPageFakeData implements PageFakeData {
  constructor (
    private readonly pageFakeDataRepository: PageFakeDataRepository
  ) {}

  async page (pageable: Pageable): Promise<Page<FakeDataModel>> {
    const page = await this.pageFakeDataRepository.page(pageable)
    page.content = page.content.map((fakeData) => ({ id: fakeData.id, ...fakeData.content }))
    return page
  }
}
