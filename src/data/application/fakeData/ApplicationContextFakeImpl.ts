import { ApplicationContextFake, FakeContext } from '../../../data/protocols/application/fakeData/ApplicationContextFake'
import { Project } from '../../../domain/model/Project'
import { Resource } from '../../../domain/model/Resource'

export class ApplicationContextFakeImpl implements ApplicationContextFake {
  private project: Project
  private resource: Resource

  async getFakeContext (): Promise<FakeContext> {
    if (!this.project || !this.resource) throw new Error('Fail on load ApplicationContextFake')

    return await Promise.resolve({
      project: this.project,
      resource: this.resource
    })
  }

  async setFakeContext (fakeContext: FakeContext): Promise<void> {
    if (!fakeContext.project || !fakeContext.resource) throw new Error('Fail on set ApplicationContextFake')

    this.project = fakeContext.project
    this.resource = fakeContext.resource
  }
}
