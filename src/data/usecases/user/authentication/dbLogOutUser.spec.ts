import { DbLogOutUser } from './DbLogOutUser'
import { Decrypter } from '../../../protocols/cryptography/Decrypter'
import { DeleteUserAccessTokensByUserIdRepository } from '../../../../data/protocols/user/DeleteUserAccessTokensByUserIdRepository'
import { DeleteUserRefreshTokensByUserIdRepository } from 'src/data/protocols/user/DeleteUserRefreshTokensByUserIdRepository'

const makeDeleteUserAccessTokensByUserIdRepository = (): DeleteUserAccessTokensByUserIdRepository => {
  class DeleteUserAccessTokensByUserIdRepositoryStub implements DeleteUserAccessTokensByUserIdRepository {
    async deleteAccessTokensByUserId (_userId: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new DeleteUserAccessTokensByUserIdRepositoryStub()
}

const makeDeleteUserRefreshTokensByUserIdRepository = (): DeleteUserRefreshTokensByUserIdRepository => {
  class DeleteUserRefreshTokensByUserIdRepositoryStub implements DeleteUserRefreshTokensByUserIdRepository {
    async deleteRefreshTokensByUserId (_userId: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new DeleteUserRefreshTokensByUserIdRepositoryStub()
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (_input: string): Promise<any> {
      return await Promise.resolve({
        id: 'any_id'
      })
    }
  }

  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLogOutUser
  decrypterStub: Decrypter
  deleteUserAccessTokensByUserIdStub: DeleteUserAccessTokensByUserIdRepository
  deleteUserRefreshTokensByUserIdStub: DeleteUserRefreshTokensByUserIdRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const deleteUserAccessTokensByUserIdStub = makeDeleteUserAccessTokensByUserIdRepository()
  const deleteUserRefreshTokensByUserIdStub = makeDeleteUserRefreshTokensByUserIdRepository()
  const sut = new DbLogOutUser(decrypterStub, deleteUserAccessTokensByUserIdStub, deleteUserRefreshTokensByUserIdStub)

  return {
    sut,
    decrypterStub,
    deleteUserAccessTokensByUserIdStub,
    deleteUserRefreshTokensByUserIdStub
  }
}

describe('DbLogOutUser', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()

    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.logout('any_token')

    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should throws if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promise = sut.logout('any_token')

    await expect(promise).rejects.toThrowError()
  })

  test('Should call DeleteUserAccessTokensByUserIdRepository with correct value', async () => {
    const { sut, deleteUserAccessTokensByUserIdStub } = makeSut()

    const deleteUserAccessSpy = jest.spyOn(deleteUserAccessTokensByUserIdStub, 'deleteAccessTokensByUserId')
    await sut.logout('any_token')

    expect(deleteUserAccessSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throws if DeleteUserAccessTokensByUserIdRepository throws', async () => {
    const { sut, deleteUserAccessTokensByUserIdStub } = makeSut()

    jest.spyOn(deleteUserAccessTokensByUserIdStub, 'deleteAccessTokensByUserId').mockRejectedValueOnce(new Error())
    const promise = sut.logout('any_token')

    await expect(promise).rejects.toThrowError()
  })

  test('Should call DeleteUserRefreshTokensByUserIdRepository with correct value', async () => {
    const { sut, deleteUserRefreshTokensByUserIdStub } = makeSut()

    const deleteUserAccessSpy = jest.spyOn(deleteUserRefreshTokensByUserIdStub, 'deleteRefreshTokensByUserId')
    await sut.logout('any_token')

    expect(deleteUserAccessSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throws if DeleteUserRefreshTokensByUserIdRepository throws', async () => {
    const { sut, deleteUserRefreshTokensByUserIdStub } = makeSut()

    jest.spyOn(deleteUserRefreshTokensByUserIdStub, 'deleteRefreshTokensByUserId').mockRejectedValueOnce(new Error())
    const promise = sut.logout('any_token')

    await expect(promise).rejects.toThrowError()
  })

  test('Should not execute DeleteUserRefreshTokensByUserIdRepository if Decrypter returns null', async () => {
    const { sut, decrypterStub, deleteUserRefreshTokensByUserIdStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const deleteRefreshTokenSpy = jest.spyOn(deleteUserRefreshTokensByUserIdStub, 'deleteRefreshTokensByUserId')
    await sut.logout('any_token')

    expect(deleteRefreshTokenSpy).not.toHaveBeenCalled()
  })

  test('Should not execute DeleteUserAccessTokensByUserIdRepository if Decrypter returns null', async () => {
    const { sut, decrypterStub, deleteUserAccessTokensByUserIdStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const deleteRefreshTokenSpy = jest.spyOn(deleteUserAccessTokensByUserIdStub, 'deleteAccessTokensByUserId')
    await sut.logout('any_token')

    expect(deleteRefreshTokenSpy).not.toHaveBeenCalled()
  })
})
