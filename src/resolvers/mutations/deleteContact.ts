import { UserMDB } from "../../models/user";
import { decodeToken } from "../../auth/decodeToken";
import { contactsDeletionData } from "../../models/contacts";

export const removeContact = async (contact: any): Promise<contactsDeletionData> => {
  //verify if the token was provided is correct
  const decodedToken = decodeToken(contact?.token);
  // if something's wrong trows the error
  if (decodedToken === null || decodedToken === undefined) {
    return { contactHasDeleted: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  // removes the contact was provided
  const id = decodedToken.userId
  const userRes = await UserMDB.findByIdAndUpdate(id, { $pull: { contacts: `${contact?.email}` } });
  // if something's wrong trows the error
  if (userRes === undefined || userRes === null) {
    return { contactHasDeleted: false, err: { errorCode: 6, errorDesc: "Error Was Ocurred, try again" } }
  }

  return { contactHasDeleted: true }
}