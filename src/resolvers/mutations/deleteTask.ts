import { decodeToken } from "../../auth/decodeToken";
import { ProyectsMDB } from "../../models/proyects";
import { tasksDeletionData, TasksMDB } from "../../models/tasks";
import { UserMDB } from "../../models/user";

export const removeTask = async (task: any): Promise<tasksDeletionData> => {
  const decodedToken = decodeToken(task?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { taskHasDeleted: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } };
  }

  const taskId = task?.taskId;
  const TaskRes: any = await TasksMDB.findById(taskId);
  if (TaskRes === undefined || TaskRes === null) {
    return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
  }
  const proyectId = TaskRes?.proyectId;
  const membersForQuery = TaskRes?.members;

  const deleteOneTaskFromMembersUserData = async (member: any) => {
    const userRes = await UserMDB.findByIdAndUpdate(member, { $pull: { tasks: `${taskId}` } });
    if (userRes === undefined || userRes === null) {
      return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
    }
  }

  await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
    await deleteOneTaskFromMembersUserData(member);
  }));

  const proyectRes = await ProyectsMDB.findByIdAndUpdate(proyectId, { $pull: { tasks: `${taskId}` } });
  if (proyectRes === undefined || proyectRes === null) {
    return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
  }

  const res = await TasksMDB.findByIdAndRemove(taskId);
  if (res === undefined || res === null) {
    return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
  }
  return { taskHasDeleted: true };
}