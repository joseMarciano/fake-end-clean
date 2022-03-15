import { Page, Pageable } from '../../commons/Page'
import { FakeDataModel } from '../FakeDataModel'

export interface PageFakeData {
  page: (pageable: Pageable) => Promise<Page<FakeDataModel>>
}
