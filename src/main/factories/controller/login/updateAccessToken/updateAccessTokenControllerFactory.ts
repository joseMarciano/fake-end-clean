import { Controller } from '../../../../../presentation/protocols'
import { UpdateUserAccessTokenController } from '../../../../../presentation/controllers/login/updateUserAccessToken/UpdateUserAccessTokenController'
import { makeDbUpdateUserAccessToken } from '../../../../../main/factories/usecases/user/dbUpdateUserAccessToken'

export const makeUpdateAccessTokenController = (): Controller => {
  const dbUpdateUserAccessToken = makeDbUpdateUserAccessToken()
  return new UpdateUserAccessTokenController(dbUpdateUserAccessToken)
}
