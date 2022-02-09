import { Notification } from '../../data/notification/Notification'
import nodeMailer, { Transporter } from 'nodemailer'

export class EmailNotification implements Notification {
  private readonly transporter: Transporter

  constructor () {
    this.transporter = this.setUp()
  }

  async send (input: any): Promise<void> {
    await this.transporter.sendMail({
      from: '"Fake end 👻" <fakendapi@gmail.com>',
      to: input,
      subject: 'Welcome to fake end ✔',
      html: '<a target="_blank" href="http://localhost:8080/active">Click here to activate your account</a>'
    })
  }

  private setUp (): Transporter {
    return nodeMailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'fakendapi@gmail.com',
        pass: 'corei57th'
      }
    })
  }
}
