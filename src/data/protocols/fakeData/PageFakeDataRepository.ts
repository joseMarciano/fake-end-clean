import { FakeData } from 'src/domain/model/FakeData'
import { Page, Pageable } from '../../../domain/usecases/commons/Page'

export interface PageFakeDataRepository {
  page: (pageable: Pageable) => Promise<Page<FakeData>>
}
