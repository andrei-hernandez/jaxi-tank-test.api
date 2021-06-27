import { decodeToken } from "../../auth/decodeToken";
import { membersCreationData, MembersInput, ProyectsMDB } from "../../models/proyects";

export const addNewMember = async (newItemMember: MembersInput): Promise<membersCreationData> => {
  const decodedToken = decodeToken(newItemMember?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { memberHasAdded: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = newItemMember?.proyectId;

  const memberExist = await ProyectsMDB.findById(id, { members: { $elemMatch: { $gte: { email: `${newItemMember?.email}` } } } });

  const emailToCompare = memberExist?.members?.[0]?.email;

  if (memberExist?.members?.length !== 0 && emailToCompare === newItemMember?.email) {
    return { memberHasAdded: false, err: { errorCode: 6, errorDesc: "Contact Exists" } }
  }

  const res = await ProyectsMDB.findByIdAndUpdate(id, { $push: { members: { email: newItemMember?.email, role: newItemMember?.role } } });
  if (res === null || res === undefined) {
    return { memberHasAdded: false, err: { errorCode: 7, errorDesc: "Error occurred, please try agaiin" } }
  }

  return { memberHasAdded: true }
}