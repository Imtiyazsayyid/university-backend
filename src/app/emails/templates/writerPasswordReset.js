export default function donorPasswordReset(donor) {
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
        border-radius: 3rem;
        height: 60%;
        padding: 5%;
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
    <p>Hello ${donor.firstName} ${donor.lastName},</p>
    <p>You have successfully reset your password.</p>

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
