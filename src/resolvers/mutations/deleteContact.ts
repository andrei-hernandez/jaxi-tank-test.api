import { decodeToken } from "../../auth/decodeToken";
import { contactsDeletionData } from "../../models/contacts";
import { UserMDB } from "../../models/user";

export const removeContact = async (contact: any): Promise<contactsDeletionData> => {
  const decodedToken = decodeToken(contact?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { contactHasDeleted: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = decodedToken.userId
  const userRes = await UserMDB.findByIdAndUpdate(id, { $pull: { contacts: `${contact?.email}` } });
  if (userRes === undefined || userRes === null) {
    return { contactHasDeleted: false, err: { errorCode: 6, errorDesc: "Error Was Ocurred, try again" } }
  }

  return { contactHasDeleted: true }
}