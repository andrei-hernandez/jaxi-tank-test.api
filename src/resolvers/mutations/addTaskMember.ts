import { decodeToken } from "../../auth/decodeToken";
import { taskMembersCreationData, TasksMDB } from "../../models/tasks";

export const createTaskMember = async (member: any): Promise<taskMembersCreationData> => {
  const decodedToken = decodeToken(member?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { memberHasAdded: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = member?.taskId
  const res = await TasksMDB.findByIdAndUpdate(id, { $push: { members: `${member?.memberId}` } });
  if (res === null || res === undefined) {
    return { memberHasAdded: false, err: { errorCode: 7, errorDesc: "Error occurred, please try agaiin" } }
  }
  return { memberHasAdded: true }
}