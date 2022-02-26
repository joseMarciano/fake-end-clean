import { GetUserContext, SetUserContext } from './UserContext'

export interface ApplicationContext extends GetUserContext, SetUserContext {}
