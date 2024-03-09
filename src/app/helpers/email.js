const nodemailer = require("nodemailer");

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

const mailOptions = {
  from: email,
};

module.exports = {
  transporter,
  mailOptions,
};
