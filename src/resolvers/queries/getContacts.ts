import { UserMDB } from "../../models/user";
import { decodeToken } from "../../auth/decodeToken";
import { UserContactData } from "../../models/contacts";

export const contactsResolver = async (token: string): Promise<Array<UserContactData | any> | any> => {
  // verify if the token was provided is correct
  const decompressedToken = decodeToken(token);
  const id = decompressedToken?.userId;
  const user = await UserMDB.findById(id);

  // creates a new array with the contacts in the user response
  const arr: Array<string | any> = user?.contacts || [];

  // creates a new array for the response
  let contacts: Array<UserContactData | any> = [];

  // function to get id, userName, email, avatar to the all the contacts in the account and push them in the contacts array to the response
  const getOneContact = async (contact: string) => {
    const res = await UserMDB.findOne({ email: contact }, '_id userName email avatar');
    contacts.push(res);
  }

  // maps the contacts in the user
  await Promise.all(arr?.map(async (contact: any): Promise<any> => {
    await getOneContact(contact);
  }));

  return { contacts };
}