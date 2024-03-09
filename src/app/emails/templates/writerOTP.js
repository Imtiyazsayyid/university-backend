export default function donorOTP(writer, message) {
  return `
  <html lang="en">
  <head>
    <style>
      body {
        font-family: sans-serif;
        padding: 40px;
      }
      .heading-section {
        width: 100%;
        height: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #141110;
        flex-direction: column;
        margin-bottom: 1rem;
      }

      .body-section {
        background-color: #ede0d9;
        height: 60%;
        padding: 5%;
        border-radius: 3rem;
      }

      .otp-container {
        display: flex;
        justify-content: center;
        margin: 2rem 0;
      }

      .otp-box {
        padding: 0.5rem 2rem;
        border-radius: 1rem;
        background-color: #fff;
        width: fit-content;
      }
    </style>
  </head>
  <body>
    <div class="heading-section poppins">
      <h1 style="text-align: center">Welcome To Literary Lantern</h1>
    </div>
    <div class="body-section">
      <p>Hello ${writer.firstName} ${writer.lastName},</p>
      <p>We have gotten a request from you to ${message}. Please verify your email by using the OTP below.</p>

      <div class="otp-container">
        <div class="otp-box">
          <h2>${writer.otp}</h2>
        </div>
      </div>

      <p>If this was not you contact us.</p>
      <p>
        Best regards,<br />
        Literary Lantern <br /><br />
      </p>
    </div>
  </body>
</html>

  `;
}
