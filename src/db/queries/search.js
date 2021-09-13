import faunadb from "faunadb";
import { SendMail, findHashtags } from "../../helpers";
const q = faunadb.query;
const { Match, Paginate, Index, Lambda, Let, Var, Get } = q;

function searchPeopleAndTags(client, keyword) {
  return client
    .query(
      Let(
        {
          // Matching an index return a setref
          setref: Match(
            Index("hashtags_and_users_by_wordparts"),
            keyword.toLowerCase()
          ),
          // We materialize this setref (get the actual index values) to be able to map over it.
          // We only consider the first page which we'll set to 10 elements, this should be enough for an autocomplete.
          pages: Paginate(Var("setref"), { size: 10 }),
          // We have defined two values in the index so it returns
          // [[ 10, <user or tag ref>], [8, <user or tag ref], ...]
          // two values for each match, the length and the reference. Let's fetch the references
          references: q.Map(Var("pages"), Lambda(["user", "ref"], Var("ref"))),
        },
        // Finally we can get get data that is associated with these references via Get!
        q.Map(Var("references"), Lambda(["ref"], Get(Var("ref"))))
      )
    )
    .then((res) => res);
}

export { searchPeopleAndTags };
