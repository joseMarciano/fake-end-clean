/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ApplicationContextFake } from '../../../data/protocols/application/fakeData/ApplicationContextFake'
import { ApplicationContextFakeImpl } from './ApplicationContextFakeImpl'

const makeSut = (): ApplicationContextFake => {
  return new ApplicationContextFakeImpl()
}

describe('ApplicationContextFakeImpl', () => {
  test('Should throw Error if project is null', async () => {
    const sut = makeSut()
    await expect(sut.getFakeContext()).rejects.toThrowError(new Error('Fail on load ApplicationContextFake'))
  })

  test('Should throw Error if resource is null', async () => {
    const sut = makeSut()
    sut['project' as keyof ApplicationContextFakeImpl] = {} as any

    await expect(sut.getFakeContext()).rejects.toThrowError(new Error('Fail on load ApplicationContextFake'))
  })

  test('Should return  FakeContext with correct values', async () => {
    const sut = makeSut()
    sut['project' as keyof ApplicationContextFakeImpl] = { id: 'any_id' } as any
    sut['resource' as keyof ApplicationContextFakeImpl] = { id: 'any_id' } as any

    expect(await sut.getFakeContext()).toEqual({
      project: { id: 'any_id' },
      resource: { id: 'any_id' }
    })
  })

  test('Should throw Error if resource is passed as null', async () => {
    const sut = makeSut()
    await expect(sut.setFakeContext({ project: {} as any, resource: null as any })).rejects.toThrowError(new Error('Fail on set ApplicationContextFake'))
  })

  test('Should throw Error if project is passed as null', async () => {
    const sut = makeSut()
    await expect(sut.setFakeContext({ project: null as any, resource: {} as any })).rejects.toThrowError(new Error('Fail on set ApplicationContextFake'))
  })

  test('Should set FakeContext correctly', async () => {
    const sut = makeSut()
    await sut.setFakeContext({ project: { id: 'any_id' } as any, resource: { id: 'any_id' } as any })
    expect(await sut.getFakeContext()).toBeTruthy()
  })
})
