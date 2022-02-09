import nodeMailer from 'nodemailer'
import { EmailNotification } from './EmailNotification'

interface SutTypes {
  sut: EmailNotification
}

const makeSut = (): SutTypes => {
  const sut = new EmailNotification()

  return {
    sut
  }
}

describe('EmailNotification', () => {
  let mockMailer: any
  beforeAll(() => {
    mockMailer = (nodeMailer as any).mock
  })

  test('Should call sendMail with correct values', async () => {
    const { sut } = makeSut()
    await sut.send('any_email')
    expect(mockMailer.getSentMail()[0].to).toBe('any_email')
  })
})
