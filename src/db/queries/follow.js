import faunadb from "faunadb";
import { SendMail } from "../../helpers";
const q = faunadb.query;

async function Follow(client, authorid) {
  return client
    .query(q.Call(q.Function("follow"), authorid))
    .then((res) => res);
}

async function Unfollow(client, authorid) {
  return client
    .query(q.Call(q.Function("unfollow"), authorid))
    .then((res) => res);
}

async function GetFollowers(client, userid) {
  return client
    .query(q.Call(q.Function("get_followers"), userid))
    .then((res) => res);
}

async function GetFollowings(client, userid) {
  return client
    .query(q.Call(q.Function("get_following"), userid))
    .then((res) => res);
}

export { Follow, Unfollow, GetFollowers, GetFollowings };
