"use strict";

var nodemailer = require('nodemailer'); // { 
//     "from": "prisonbreak996@gmail.com",
//     "to": "npdoan1996@gmail.com",
//     "subject": "hello", 
//     "text": "hello boss"
// }
// use the link below to allow gmail send message
// https://myaccount.google.com/u/1/lesssecureapps?pli=1&rapt=AEjHL4MnlToMDKEQxvAshoZ3Cu9ORm5pUW_8OXJSPk0RCrREY8Mr0M2YP4vSMRuOd0Q4roys9fc14sPyluPyXNH1xl6fGTVWRA


function sendEmail(mailOptions) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'prisonbreak996@gmail.com',
      pass: 'Guitar996@'
    }
  });
  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;