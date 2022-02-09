const nodemailer = require('nodemailer')
const mockMailer = require('nodemailer-mock')
const nodemailerMock = mockMailer.getMockFor(nodemailer)
module.exports = nodemailerMock
