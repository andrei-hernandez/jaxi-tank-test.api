import { decodeToken } from "../../auth/decodeToken";
import { proyectDeletionData, ProyectsMDB } from "../../models/proyects";
import { TasksMDB } from "../../models/tasks";
import { UserMDB } from "../../models/user";

export const removeProyect = async (proyect: any): Promise<proyectDeletionData> => {
  const decodedToken = decodeToken(proyect?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { proyectHasDeleted: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const proyectId = proyect?.proyectId;

  const proyectRes = await ProyectsMDB.findById(proyectId);
  const membersForQuery: any = proyectRes?.members;
  const tasksForQuery: any = proyectRes?.tasks;

  const deleteOneTaskFromProyectsData = async (task: any): Promise<any> => {

    const taksRes = await TasksMDB.findById(task);
    const taskMembersForQuery: any = taksRes?.members;

    const deleteOneTaskMemberFromTasksData = async (member: any): Promise<any> => {
      const userRes = await UserMDB.findByIdAndUpdate(member, { $pull: { tasks: `${task}` } });
      if (userRes === null || userRes === undefined) {
        return { proyectHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
      }
    }

    await Promise.all(taskMembersForQuery?.map(async (member: any): Promise<any> => {
      deleteOneTaskMemberFromTasksData(member);
    }));

    const res = await TasksMDB.findByIdAndRemove(task);
    if (res === null || res === undefined) {
      return { proyectHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
    }
  }

  await Promise.all(tasksForQuery?.map(async (task: any): Promise<any> => {
    deleteOneTaskFromProyectsData(task);
  }));

  const deleteOneProyectFromMembersUserData = async (member: any): Promise<any> => {
    const userId = member?.userId;
    const userRes = await UserMDB.findByIdAndUpdate(userId, { $pull: { proyects: `${proyectId}` } });
    if (userRes === undefined || userRes === null) {
      return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
    }
  }

  await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
    await deleteOneProyectFromMembersUserData(member);
  }));


  const res = await ProyectsMDB.findByIdAndRemove(proyectId);
  if (res === undefined || res === null) {
    return { proyectHasDeleted: false, err: { errorCode: 6, errorDesc: "Error was ocurred, try again" } }
  }

  return { proyectHasDeleted: true }
}