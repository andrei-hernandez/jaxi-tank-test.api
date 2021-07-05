import { UserMDB } from "../../models/user";
import { decodeToken } from "../../auth/decodeToken";
import { contactsCreationData, ContactsInput } from "../../models/contacts";

//add contact resolver
export const addContact = async (newItemContact: ContactsInput): Promise<contactsCreationData> => {
  //calls the auth with JWT
  const decompressedToken = decodeToken(newItemContact?.token);

  //extract the user ID
  const id = decompressedToken?.userId;

  // calls the mongoose model and the method find by id to search if the contact exists
  const contactExist = await UserMDB.findById(id, { contacts: { $elemMatch: { $gte: `${newItemContact?.email}` } } });

  //returns an array which contains the elements which coincide with the query
  const emailToCompare = contactExist?.contacts?.[0] || "";

  //and here validates
  if (contactExist?.contacts?.length !== 0 && emailToCompare === newItemContact.email) {
    return { contactHasCreated: false, err: { errorCode: 3, errorDesc: "Contact Exists" } }
  }

  // if don't exists procede to storage the contact in the contacts array
  const res = await UserMDB.findByIdAndUpdate(id, { $push: { contacts: newItemContact?.email } });

  // if something's wrong, returns the data
  if (res === null || res === undefined) {
    return { contactHasCreated: false, err: { errorCode: 4, errorDesc: "Error occurred, please try agaiin" } }
  }

  return { contactHasCreated: true }
};