import { Project } from '../../../../domain/model/Project'

export type ProjectModel = Omit<Project, 'user'>
