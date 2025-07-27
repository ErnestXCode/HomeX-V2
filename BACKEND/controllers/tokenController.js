const axios = require("axios");

const createToken = async (req, res, next) => {
  const secret = "2u8Kx4nWvI8mQVbXcNGsbJISY6yAqSAqk31qQbAGJAxwR2xUDRUkUc4DQryuRYn4";
  const consumer = "Cn7uYrUrO0GwOnGseymp6R2rT5RF9vjw6jPr9Q9xggHL9h10";
  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");

  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )
    .then((data) => {
      console.log(data.data);
      next();
    })
    .catch((err) => console.log("error in mpesa ", err));
};




module.exports = createToken;
