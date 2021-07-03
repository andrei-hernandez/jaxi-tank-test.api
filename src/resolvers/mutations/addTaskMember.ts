import { decodeToken } from "../../auth/decodeToken";
import { taskMembersCreationData, TasksMDB } from "../../models/tasks";
import { UserMDB } from "../../models/user";

export const createTaskMember = async (member: any): Promise<taskMembersCreationData> => {
  const decodedToken = decodeToken(member?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { memberHasAdded: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const userRes = await UserMDB.findOne({ email: member?.memberEmail });
  if (userRes === undefined || userRes === null) {
    return { memberHasAdded: false, err: { errorCode: 6, errorDesc: "Account don't exists" } }
  }

  const id = member?.taskId
  const res = await TasksMDB.findByIdAndUpdate(id, { $push: { members: `${userRes?.id}` } });
  if (res === null || res === undefined) {
    return { memberHasAdded: false, err: { errorCode: 7, errorDesc: "Error occurred, please try agaiin" } }
  }
  return { memberHasAdded: true }
}