const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const { credentials } = require("../config");

const mailTransport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: credentials.sendgrid.apiKey,
  })
);

module.exports = mailTransport;
