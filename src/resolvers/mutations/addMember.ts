import { decodeToken } from "../../auth/decodeToken";
import { membersCreationData, MembersInput, ProyectsMDB } from "../../models/proyects";
import { UserMDB } from "../../models/user";

export const addNewMember = async (newItemMember: MembersInput): Promise<membersCreationData> => {
  const decodedToken = decodeToken(newItemMember?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { memberHasAdded: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }
  const id = newItemMember?.proyectId;

  const memberExist = await ProyectsMDB.findById(id, { members: { $elemMatch: { $gte: { email: `${newItemMember?.email}` } } } });

  const emailToCompare = memberExist?.members?.[0]?.email;
  if (memberExist?.members?.length !== 0 && emailToCompare === newItemMember?.email) {
    return { memberHasAdded: false, err: { errorCode: 6, errorDesc: "Member Exists" } }
  }

  const userRes = await UserMDB.findOne({ email: newItemMember?.email }, 'id email');
  if (userRes === undefined || userRes === null) {
    return { memberHasAdded: false, err: { errorCode: 6, errorDesc: "Account don't exists" } }
  }

  const userAddProyectRes = await UserMDB.findByIdAndUpdate(userRes?.id, { $push: { proyects: newItemMember?.proyectId } });
  if (userAddProyectRes === undefined || userAddProyectRes === null) {
    return { memberHasAdded: false, err: { errorCode: 6, errorDesc: "Error ocurred, please try again" } }
  }

  const res = await ProyectsMDB.findByIdAndUpdate(id, { $push: { members: { userId: userRes?.id, role: newItemMember?.role } } });
  if (res === null || res === undefined) {
    return { memberHasAdded: false, err: { errorCode: 7, errorDesc: "Error occurred, please try agaiin" } }
  }

  return { memberHasAdded: true }
}