const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const htmlToFormattedtext = require("html-to-formatted-text");

module.exports = (credentials) => {
  const mailTransport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: credentials.sendgrid.apiKey,
    })
  );

  const from = "Trello Clone <maaahad@gmail.com>";
  // || need to use errorRecipient somehow
  const errorRecipient = "maaahad@gmail.com";

  return {
    send: (to, subject, html) =>
      mailTransport.sendMail({
        from,
        to,
        subject,
        html,
        text: htmlToFormattedtext(html),
      }),
  };
};
