import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
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
    console.log(currentUser);
    return currentUser.documents[0];
  } catch (Error) {
    console.log(Error);
  }
};
