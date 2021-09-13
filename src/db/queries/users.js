import faunadb from "faunadb";
import cloudinary from "cloudinary";
cloudinary.v2;
const q = faunadb.query;
import {
  blobServiceClient,
  getBlobName,
  uploadOptions,
} from "../../helpers/azure";
import { intoStream } from "../../helpers/into-stream";

function UpdateUser(client, fullname, username, bio) {
  return client
    .query(q.Call(q.Function("update_user"), fullname, username, bio))
    .then((res) => res);
}

async function UploadMediaFile(client, req) {
  const blobName = getBlobName(req.file.originalname);
  const stream = intoStream(req.file.buffer);
  const containerClient = blobServiceClient.getContainerClient("profileimages");
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadStream(
    stream,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers,
    { blobHTTPHeaders: { blobContentType: "image/png" } }
  );

  const icon = `https://therrappy.blob.core.windows.net/profileimages/${blobName}`;

  return client
    .query(
      q.Call(
        // q.Let(
        //   {
        //     accountRef: q.CurrentIdentity(),
        //     userRef: q.Select(["data", "user"], q.Get(Var("accountRef"))),
        //   },
        //   q.Update(q.Var("userRef"), { data: { icon: icon } })
        // )
        q.Function("update_user_icon"),
        icon
      )
    )
    .then((res) => res);
}

function GetProfile(client) {
  return client.query(q.Call(q.Function("get_profile"))).then((res) => res);
}

function GetRatings(client) {
  return client.query(q.Call(q.Function("get_ratings"))).then((res) => res);
}

function DeleteUserAndAccount(client) {
  return client
    .query(q.Call(q.Function("delete_user_and_account")))
    .then((res) => res);
}

export {
  UpdateUser,
  UploadMediaFile,
  GetProfile,
  GetRatings,
  DeleteUserAndAccount,
};
