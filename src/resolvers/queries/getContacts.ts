import { decodeToken } from "../../auth/decodeToken";
import { UserContactData } from "../../models/contacts";
import { UserMDB } from "../../models/user";

export const contactsResolver = async (token: string): Promise<Array<UserContactData | any> | any> => {
  const decompressedToken = decodeToken(token);
  const id = decompressedToken?.userId;
  const user = await UserMDB.findById(id);

  const arr: Array<string | any> = user?.contacts || [];
  let contacts: Array<UserContactData | any> = [];

  const getOneContact = async (contact: string) => {
    const res = await UserMDB.findOne({ email: contact }, '_id userName email avatar');
    contacts.push(res);
  }

  await Promise.all(arr?.map(async (contact: any): Promise<any> => {
    await getOneContact(contact);
  }));

  return { contacts };
}