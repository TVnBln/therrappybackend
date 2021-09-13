import faunadb from "faunadb";
import { SendMail, findHashtags } from "../../helpers";
const q = faunadb.query;
const { Match, Paginate, Index, Lambda, Let, Var, Get } = q;

function GetDefaultSettings(client) {
  const defaultSettings = {
    notifications: {
      pushNotifications: {
        pauseAll: false,
        postsAndComments: {
          likes: {
            slug: "from_everyone",
            name: "From Everyone",
          },
          comments: {
            slug: "from_everyone",
            name: "From Everyone",
          },
          commentLikes: {
            slug: "on",
            name: "On",
          },
        },
        follower: {
          follower: {
            slug: "on",
            name: "On",
          },
        },
        directMessages: {
          messageRequest: {
            slug: "on",
            name: "On",
          },
          messages: {
            slug: "on",
            name: "On",
          },
          videoChats: {
            slug: "from_everyone",
            name: "From Everyone",
          },
        },
      },
      emailAndSmsNotifications: {
        feedbackEmail: true,
        reminderEmail: true,
        productEmail: true,
        newsEmail: true,
      },
    },
    account: {
      language: "English",
    },
    theme: "Dark",
  };

  return defaultSettings;
}

function GetCurrentSettings(client) {
  return client.query(q.Call(q.Function("get_settings"))).then((res) => res);
}

function SetDefaultSettings(client) {
  return client
    .query(q.Call(q.Function("set_default_settings")))
    .then((res) => res);
}

function SetCurrentSettings(client, data) {
  return client
    .query(q.Call(q.Function("set_settings"), data))
    .then((res) => res);
}

export {
  GetDefaultSettings,
  GetCurrentSettings,
  SetDefaultSettings,
  SetCurrentSettings,
};
