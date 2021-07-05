import { UserMDB } from "../../models/user";
import { ProyectsMDB } from "../../models/proyects";
import { decodeToken } from "../../auth/decodeToken";
import { tasksDeletionData, TasksMDB } from "../../models/tasks";

export const removeTask = async (task: any): Promise<tasksDeletionData> => {
  // verify if the token was provided is correct
  const decodedToken = decodeToken(task?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { taskHasDeleted: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } };
  }

  // finds the task will be deleted
  const taskId = task?.taskId;
  const TaskRes: any = await TasksMDB.findById(taskId);
  // if something's wrong trows the error
  if (TaskRes === undefined || TaskRes === null) {
    return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
  }
  const proyectId = TaskRes?.proyectId;

  // create an array for delete the task reference in all members
  const membersForQuery = TaskRes?.members;

  //function which delete the task reference in all members
  const deleteOneTaskFromMembersUserData = async (member: any) => {
    const userRes = await UserMDB.findByIdAndUpdate(member, { $pull: { tasks: `${taskId}` } });
    if (userRes === undefined || userRes === null) {
      return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
    }
  }

  /// maps the all members will be deleted the task reference 
  await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
    await deleteOneTaskFromMembersUserData(member);
  }));

  // removes the task reference in the proyect Id was provided
  const proyectRes = await ProyectsMDB.findByIdAndUpdate(proyectId, { $pull: { tasks: `${taskId}` } });
  // if something's wrong trows the error
  if (proyectRes === undefined || proyectRes === null) {
    return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
  }

  // removes the task
  const res = await TasksMDB.findByIdAndRemove(taskId);
  // if something's wrong trows the error
  if (res === undefined || res === null) {
    return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
  }

  return { taskHasDeleted: true };
}