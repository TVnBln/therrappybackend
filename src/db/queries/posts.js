import faunadb from "faunadb";
import { SendMail, findHashtags } from "../../helpers";
const q = faunadb.query;
import {
  blobServiceClient,
  getBlobName,
  uploadOptions,
  getFileExtension,
} from "../../helpers/azure";
import { intoStream } from "../../helpers/into-stream";

async function createPost(client, message, req) {
  const files = [];
  req.files.forEach(async (file) => {
    const fileExtension = getFileExtension(file.originalname);
    console.log(fileExtension);
    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg"
    ) {
      const blobName = getBlobName(file.originalname);
      const stream = intoStream(file.buffer);
      const containerClient =
        blobServiceClient.getContainerClient("postimages");
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      files.push(
        `https://therrappy.blob.core.windows.net/postimages/${blobName}`
      );

      await blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxBuffers,
        { blobHTTPHeaders: { blobContentType: `image/${fileExtension}` } }
      );
    } else if (fileExtension === "svg") {
      const blobName = getBlobName(file.originalname);
      const stream = intoStream(file.buffer);
      const containerClient =
        blobServiceClient.getContainerClient("postimages");
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      files.push(
        `https://therrappy.blob.core.windows.net/postimages/${blobName}`
      );

      await blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxBuffers,
        { blobHTTPHeaders: { blobContentType: "image/svg+xml" } }
      );
    } else if (fileExtension === "mp4") {
      const blobName = getBlobName(file.originalname);
      const stream = intoStream(file.buffer);
      const containerClient = blobServiceClient.getContainerClient("postmedia");
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      files.push(
        `https://therrappy.blob.core.windows.net/postmedia/${blobName}`
      );

      await blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxBuffers,
        { blobHTTPHeaders: { blobContentType: "video/mp4" } }
      );
    } else {
      return { error: "This extensions type is not supported" };
    }
  });

  console.log(files);

  const hashTags = findHashtags(message).map((t) => t.substring(1));
  return client
    .query(q.Call(q.Function("create_post"), message, hashTags, files))
    .then((res) => res);
}

function getPosts(client) {
  return client.query(q.Call(q.Function("get_posts"))).then((res) => res);
}

function getPostsByTag(client, tag) {
  return client
    .query(q.Call(q.Function("get_posts_by_tag"), tag))
    .then((res) => res);
}

function getPostsByAuthor(client, authorAlias) {
  return client
    .query(q.Call(q.Function("get_posts_by_author"), authorAlias))
    .then((res) => res);
}

function comment(client, postid, message) {
  return client
    .query(q.Call(q.Function("comment"), postid, message))
    .then((res) => res);
}

function ratePost(client, postid, rating) {
  return client
    .query(q.Call(q.Function("ratepost"), postid, rating))
    .then((res) => res);
}

function removeRating(client, postid) {
  return client
    .query(q.Call(q.Function("remove_rating_from_post"), postid))
    .then((res) => res);
}

export {
  createPost,
  getPosts,
  getPostsByTag,
  getPostsByAuthor,
  comment,
  ratePost,
  removeRating,
};
