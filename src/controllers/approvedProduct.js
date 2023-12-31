const { Product, User } = require("../db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const approvedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productFound = await Product.findByPk(id);

    if (!productFound) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updateValue = !productFound.approved;
    const userId = productFound.userId;
    const foundUser = await User.findByPk(userId);

    await productFound.update({ approved: updateValue });
    await productFound.update({ paused: !updateValue });

    if (userId !== null) {
      if (productFound.approved === true) {
        await transporter.sendMail({
          from: `GreenWave ${process.env.EMAIL}`,
          to: foundUser.email,
          subject: "Product approved",
          html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Envio de correo Electronico con NodeJS</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600&display=swap"
              rel="stylesheet" />
            <style>
              html {
                height: 100%;
              }
              body {
                position: absolute;
                bottom: 0;
                right: 0;
                font-family: "Instrument Sans", sans-serif;
              }
              .content {
                top: 0;
                margin: 0 auto;
                width: 90%;
                height: 100vh;
                background-color: #f2f4f8;
              }
              .logo {
                position: absolute;
                bottom: 0;
                right: 0;
                margin: 10px;
                width: 150px;
                margin-right: 50px;
              }
              h1 {
                color: #22b5a0;
                padding: 30px 5px;
              }
              h3 {
                text-align: center;
              }
              section {
                padding: 5px 50px;
              }
              p {
                text-align: justify;
                color: #666 !important;
              }
              hr {
                border: 1px solid #eee;
              }
            </style>
          </head>
          <body>
            <div class="content">

              <h1 style="text-align: center">
              Your product is approved
                <hr />
              </h1>

              <section>
                <h3>
                We invite you to check the status of your product on our website.
                </h3>
                <p>
                Your product has been approved.
                It is now available along with the rest of the publications on our website.
                Thank you for your patience and for continuing to choose us!               
                </p>
                <br />
                <h3>Thank you for joining us!</h3>
              </section>

            <img
              class="logo"
              src="https://media.discordapp.net/attachments/1172286566689939527/1174431440478412841/Green_Wave.png?ex=657a0683&is=65679183&hm=786fe24053b53605b7c58d75b2e386e2c25ebeadb8c662545e631b4f2c2ad6a7&=&format=webp&quality=lossless&width=269&height=212"
              alt="Urian-Viera Logo" /> 

           </div>
          </body>
        </html>`,
        });
      } else {
        await transporter.sendMail({
          from: `GreenWave ${process.env.EMAIL}`,
          to: foundUser.email,
          subject: "Product pending",
          html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Envio de correo Electronico con NodeJS</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600&display=swap"
              rel="stylesheet" />
            <style>
              html {
                height: 100%;
              }
              body {
                position: absolute;
                bottom: 0;
                right: 0;
                font-family: "Instrument Sans", sans-serif;
              }
              .content {
                top: 0;
                margin: 0 auto;
                width: 90%;
                height: 100vh;
                background-color: #f2f4f8;
              }
              .logo {
                position: absolute;
                bottom: 0;
                right: 0;
                margin: 10px;
                width: 150px;
                margin-right: 50px;
              }
              h1 {
                color: #22b5a0;
                padding: 30px 5px;
              }
              h3 {
                text-align: center;
              }
              section {
                padding: 5px 50px;
              }
              p {
                text-align: justify;
                color: #666 !important;
              }
              hr {
                border: 1px solid #eee;
              }
            </style>
          </head>
          <body>
            <div class="content">

              <h1 style="text-align: center">
              Your product is pending to approve
                <hr />
              </h1>

              <section>
                <h3>
                We invite you to check the status of your product on our website.
                </h3>
                <p>
                Your product is pending to approve.
               In the next 24 hours you will receive an email if your product was approved by the Green Wave team
                </p>
                <br />
                <h3>Thank you for joining us!</h3>
              </section>

            <img
              class="logo"
              src="https://media.discordapp.net/attachments/1172286566689939527/1174431440478412841/Green_Wave.png?ex=657a0683&is=65679183&hm=786fe24053b53605b7c58d75b2e386e2c25ebeadb8c662545e631b4f2c2ad6a7&=&format=webp&quality=lossless&width=269&height=212"
              alt="Urian-Viera Logo" /> 

           </div>
          </body>
        </html>`,
        });
      }
    }

    return res
      .status(200)
      .json({ message: "Publication successfully approved" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { approvedProduct };
