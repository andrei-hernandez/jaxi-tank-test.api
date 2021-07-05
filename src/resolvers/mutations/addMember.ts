import { UserMDB } from "../../models/user";
import { decodeToken } from "../../auth/decodeToken";
import { membersCreationData, MembersInput, ProyectsMDB } from "../../models/proyects";

export const addNewMember = async (newItemMember: MembersInput): Promise<membersCreationData> => {
  //calls the auth with JWT
  const decodedToken = decodeToken(newItemMember?.token);

  // if something's wrong, returns the data
  if (decodedToken === null || decodedToken === undefined) {
    return { memberHasAdded: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  // store the proyectId
  const id = newItemMember?.proyectId;

  // check if the member exists in the proyect 
  const memberExist = await ProyectsMDB.findById(id, { members: { $elemMatch: { $gte: { email: `${newItemMember?.email}` } } } });

  const emailToCompare = memberExist?.members?.[0]?.email;

  // if exists trow the error
  if (memberExist?.members?.length !== 0 && emailToCompare === newItemMember?.email) {
    return { memberHasAdded: false, err: { errorCode: 6, errorDesc: "Member Exists" } }
  }

  // if don't exists, gets the userId which coincide with the email was provided
  const userRes = await UserMDB.findOne({ email: newItemMember?.email }, 'id email');

  // if something's wrong trows the error
  if (userRes === undefined || userRes === null) {
    return { memberHasAdded: false, err: { errorCode: 6, errorDesc: "Account don't exists" } }
  }

  // add the proyect id to the proyects array in the account data on the database
  const userAddProyectRes = await UserMDB.findByIdAndUpdate(userRes?.id, { $push: { proyects: newItemMember?.proyectId } });

  // // if something's wrong trows the error
  if (userAddProyectRes === undefined || userAddProyectRes === null) {
    return { memberHasAdded: false, err: { errorCode: 6, errorDesc: "Error ocurred, please try again" } }
  }

  // add the member id to the members array in the proyect
  const res = await ProyectsMDB.findByIdAndUpdate(id, { $push: { members: { userId: userRes?.id, role: newItemMember?.role } } });
  // if something's wrong trows the error
  if (res === null || res === undefined) {
    return { memberHasAdded: false, err: { errorCode: 7, errorDesc: "Error occurred, please try agaiin" } }
  }

  return { memberHasAdded: true }
}