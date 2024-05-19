import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteconfig = {
  endpoint: "https:cloud.appwrite.io/v1",
  platform: "com.varun.aura",
  projectId: "6643caed001a848b1f6d",
  database: "6643fcd1003ccaa122ee",
  userCollectionId: "6643fd240027dd7215be",
  videoCollectionId: "6643fd01000b0e377f3a",
  storageId: "6643fec1003598e0083d",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteconfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteconfig.projectId) // Your project ID
  .setPlatform(appwriteconfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const databases = new Databases(client);

// SignUp
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    console.log("Account creation successfull");

    if (!newAccount) throw Error;

    const avatarURL = avatars.getInitials(username);
    await signIn(email, password);
    console.log("Session creation successfull");

    const newUser = await databases.createDocument(
      appwriteconfig.database,
      appwriteconfig.userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, username, avatar: avatarURL }
    );
    console.log("Database record creation successfull");

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// SignIn
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error);
  }
};

// get Current User
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteconfig.database,
      appwriteconfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (Error) {
    console.log(Error);
  }
};

// Get all prosts for current user
export const getAppPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteconfig.database,
      appwriteconfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

// Fetch latest posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteconfig.database,
      appwriteconfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

//Search Posts
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteconfig.database,
      appwriteconfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// get User Posts
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteconfig.database,
      appwriteconfig.videoCollectionId,
      [Query.equal("users", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteconfig.database,
      appwriteconfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteconfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteconfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteconfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}
