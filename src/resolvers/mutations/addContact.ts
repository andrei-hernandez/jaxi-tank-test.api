import { decodeToken } from "../../auth/decodeToken";
import { contactsCreationData, ContactsInput } from "../../models/contacts";
import { UserMDB } from "../../models/user";

export const addContact = async (newItemContact: ContactsInput): Promise<contactsCreationData> => {
  const decompressedToken = decodeToken(newItemContact?.token);
  const id = decompressedToken?.userId;
  const contactExist = await UserMDB.findById(id, { contacts: { $elemMatch: { $gte: `${newItemContact?.email}` } } });

  const emailToCompare = contactExist?.contacts?.[0] || "";

  if (contactExist?.contacts?.length !== 0 && emailToCompare === newItemContact.email) {
    return { contactHasCreated: false, err: { errorCode: 3, errorDesc: "Contact Exists" } }
  }

  const res = await UserMDB.findByIdAndUpdate(id, { $push: { contacts: newItemContact?.email } });
  if (res === null || res === undefined) {
    return { contactHasCreated: false, err: { errorCode: 4, errorDesc: "Error occurred, please try agaiin" } }
  }

  return { contactHasCreated: true }
};