import faunadb from "faunadb";
import { SendMail } from "../../helpers";
const q = faunadb.query;

function registerWithUser(
  client,
  email,
  password,
  fullname,
  username,
  bio,
  gender,
  phoneNumber,
  birthDay
) {
  const icon =
    "https://res.cloudinary.com/timovanbalen/image/upload/v1622024735/icons/mzusy0q9u0jqjovfrtpu.png";
  return client
    .query(
      q.Call(
        q.Function("register_with_user"),
        email,
        password,
        fullname,
        username,
        bio,
        icon,
        gender,
        phoneNumber,
        birthDay
      )
    )
    .then((res) => res);
}

async function login(client, email, password) {
  return client
    .query(q.Call(q.Function("login"), email, password))
    .then((res) => res);
}

async function logout(client) {
  const logoutResult = await client.query(q.Logout(true));
  return logoutResult;
  console.log(logoutResult);
}

async function forgotPassword(client, email) {
  const code = Math.floor(10000 + Math.random() * 90000);

  return client
    .query(q.Call(q.Function("forgotpassword"), email, code))
    .then((res) => res);
}

async function forgotPasswordReset(client, email, password, confirmPassword) {
  return client
    .query(
      q.Call(
        q.Function("forgotpasswordreset"),
        email,
        password,
        confirmPassword
      )
    )
    .then((res) => res);
}

async function resetPassword(client, password, confirmPassword) {
  return client
    .query(q.Call(q.Function("resetpassword"), password, confirmPassword))
    .then((res) => res);
}

export {
  registerWithUser,
  login,
  logout,
  forgotPassword,
  forgotPasswordReset,
  resetPassword,
};
