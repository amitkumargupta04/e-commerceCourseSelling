import dotenv from "dotenv";
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
//const STRIPE_SECRET_KEY ="sk_test_51RmvsmHbCZokRKghz9A9l45JHX2xfr8H8dON7Qnd4qBaLkp4BUYYzNA3MXCxboRAO8SpN0JUk19rxpeGJZHfHoDm00cbQGEJZC"

const STRIPE_SECRET_KEY = process.env.stripeSecretKey;

export default {
  JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,
};