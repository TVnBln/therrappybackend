import faunadb from "faunadb";
import sgMail from "@sendgrid/mail";
const q = faunadb.query;
import {
  registerWithUser,
  login,
  logout,
  forgotPassword,
  forgotPasswordReset,
  resetPassword,
} from "./queries/auth";
import {
  createPost,
  getPosts,
  getPostsByTag,
  getPostsByAuthor,
  ratePost,
  comment,
  removeRating,
} from "./queries/posts";
import {
  Follow,
  Unfollow,
  GetFollowers,
  GetFollowings,
} from "./queries/follow";
import {
  UpdateUser,
  GetProfile,
  UploadMediaFile,
  GetRatings,
  DeleteUserAndAccount,
} from "./queries/users";
import {
  GetDefaultSettings,
  GetCurrentSettings,
  SetDefaultSettings,
  SetCurrentSettings,
} from "./queries/settings";
import { searchPeopleAndTags } from "./queries/search";
import { ClearDB } from "./queries/extra";
import {
  createMessage,
  getLatestMessages,
  createChatRoom,
} from "./queries/chat";

class QueryManager {
  constructor(token) {
    this.headers = { "X-Fauna-Source": "therrappy-react" };
    this.bootstrapToken = token || "fnAEKOaBFWACBdFHetUV5FR0i9DYgqPJTwi7Kwvm";
    this.client = new faunadb.Client({
      headers: this.headers,
      secret: token || this.bootstrapToken,
    });
  }

  register(
    email,
    password,
    fullname,
    username,
    bio,
    gender,
    phoneNumber,
    birthDay
  ) {
    return registerWithUser(
      this.client,
      email,
      password,
      fullname,
      username,
      bio,
      gender,
      phoneNumber,
      birthDay
    ).then((res) => {
      if (res) {
        this.client = new faunadb.Client({
          headers: this.headers,
          secret: res.secret.secret,
        });
      }
      return res;
    });
  }

  login(email, password) {
    return login(this.client, email, password).then((res) => {
      if (res) {
        this.client = new faunadb.Client({
          headers: this.headers,
          secret: res.secret,
        });
      }
      return res;
    });
  }

  logout() {
    return logout(this.client).then((res) => {
      this.client = new faunadb.Client({
        headers: this.headers,
        secret: this.bootstrapToken,
      });
      return res;
    });
  }

  forgotPassword(email) {
    return forgotPassword(this.client, email).then((res) => {
      return res;
    });
  }

  forgotPasswordReset(email, password, confirmPassword) {
    return forgotPasswordReset(
      this.client,
      email,
      password,
      confirmPassword
    ).then((res) => {
      return res;
    });
  }

  resetPassword(password, confirmPassword) {
    return resetPassword(this.client, password, confirmPassword).then((res) => {
      return res;
    });
  }

  createPost(message, req) {
    return createPost(this.client, message, req);
  }

  getPosts() {
    return getPosts(this.client);
  }

  getPostsByTag(tagName) {
    return getPostsByTag(this.client, tagName);
  }

  getPostsByAuthor(authorAlias) {
    return getPostsByAuthor(this.client, authorAlias);
  }

  searchPeopleAndTags(keyword) {
    return searchPeopleAndTags(this.client, keyword);
  }

  // ratePost(postRef) {
  //   return ratePost(this.client, postRef);
  // }

  comment(postid, message) {
    return comment(this.client, postid, message);
  }

  updateUser(fullname, username, bio) {
    // we don't pass in the icon yet atm'
    return UpdateUser(this.client, fullname, username, bio);
  }

  uploadProfileImage(req) {
    return UploadMediaFile(this.client, req);
  }

  getProfile() {
    return GetProfile(this.client);
  }

  follow(authorid) {
    return Follow(this.client, authorid);
  }

  unfollow(authorid) {
    return Unfollow(this.client, authorid);
  }

  ratePost(postid, rating) {
    return ratePost(this.client, postid, rating);
  }

  getRatings() {
    return GetRatings(this.client);
  }

  getFollowers(userid) {
    return GetFollowers(this.client, userid);
  }

  getFollowings(userid) {
    return GetFollowings(this.client, userid);
  }

  getDefaultSettings() {
    return GetDefaultSettings(this.client);
  }

  getCurrentSettings() {
    return GetCurrentSettings(this.client);
  }

  setDefaultSettings() {
    return SetDefaultSettings(this.client);
  }

  setCurrentSettings(data) {
    return SetCurrentSettings(this.client, data);
  }

  deleteUserAndAccount() {
    return DeleteUserAndAccount(this.client);
  }

  clearDB() {
    return ClearDB(this.client);
  }

  removeRating(postid) {
    return removeRating(this.client, postid);
  }

  createMessage(author, message, chatRoomId) {
    return createMessage(this.client, author, message, chatRoomId);
  }

  getLatestMessages(afterTs, chatRoomId) {
    return getLatestMessages(this.client, afterTs, chatRoomId);
  }

  createChatRoom(chatRoomName, group, user1, user2) {
    return createChatRoom(this.client, chatRoomName, group, user1, user2);
  }
}

const faunaQueries = new QueryManager();
export { faunaQueries, QueryManager };
