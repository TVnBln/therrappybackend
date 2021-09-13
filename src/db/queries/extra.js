import faunadb from "faunadb";
import { SendMail } from "../../helpers";
const q = faunadb.query;

async function ClearDB(client) {
  return client.query(q.Call(q.Function("clearDB"))).then((res) => res);
}

export { ClearDB };
