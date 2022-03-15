import { Project } from '../../../../domain/model/Project'
import { Resource } from '../../../../domain/model/Resource'

export interface ApplicationContextFake extends GetFakeContext, SetFakeContext{}

export interface GetFakeContext {
  getFakeContext: () => Promise<FakeContext>
}

export interface SetFakeContext {
  setFakeContext: (fakeContext: FakeContext) => Promise<void>
}

export interface FakeContext { project: Project, resource: Resource}
