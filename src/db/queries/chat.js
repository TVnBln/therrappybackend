import faunadb from "faunadb";
import { SendMail } from "../../helpers";
const q = faunadb.query;
const {
  Paginate,
  Range,
  Match,
  Index,
  Ref,
  Collection,
  Now,
  TimeSubtract,
  ToMicros,
  Create,
  Do,
  Update,
} = q;

async function getLatestMessages(client, afterTs, chatRoomId) {
  return await client
    .query(
      Paginate(
        Range(
          Match(
            Index("chatmessages_by_chatroomref"),
            Ref(Collection("chat_rooms"), chatRoomId)
          ),
          afterTs ? afterTs : ToMicros(TimeSubtract(Now(), 1, "hour")),
          []
        ),
        {
          size: 10000,
        }
      )
    )
    .then((res) => res);
}

async function createMessage(client, author, message, chatRoomId) {
  return await client
    .query(
      Do(
        Update(Ref(Collection("chat_rooms"), chatRoomId), {}),
        Create(Collection("chat_messages"), {
          data: {
            author,
            message,
            chatRoomId,
            chatRoomRef: Ref(Collection("chat_rooms"), chatRoomId),
          },
        })
      )
    )
    .then((res) => res);
}

async function createChatRoom(client, chatRoomName, group, user1, user2) {
  return await client
    .query(
      Create(Collection("chat_rooms"), {
        data: {
          name: chatRoomName,
          group: group,
          user1,
          user2,
        },
      })
    )
    .then((res) => res);
}

export { getLatestMessages, createMessage, createChatRoom };
