import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
} from "@azure/storage-blob";
import multer from "multer";
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single(
  "profileimages"
);
const mediaStrategy = multer({ storage: inMemoryStorage }).any("postfiles");
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const sharedKeyCredentials = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_KEY
);
const pipeline = newPipeline(sharedKeyCredentials);

const blobServiceClient = new BlobServiceClient(
  process.env.AZURE_STORAGE_URL,
  pipeline
);

const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, "");
  return `${identifier}-${originalName}`;
};

const getFileExtension = (originalName) => {
  var re = /(?:\.([^.]+))?$/;
  var ext = re.exec(originalName)[1];
  return ext;
};

export {
  blobServiceClient,
  getBlobName,
  uploadOptions,
  uploadStrategy,
  getFileExtension,
  mediaStrategy,
  multer,
};
