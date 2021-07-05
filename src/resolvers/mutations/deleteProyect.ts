import { UserMDB } from "../../models/user";
import { TasksMDB } from "../../models/tasks";
import { decodeToken } from "../../auth/decodeToken";
import { proyectDeletionData, ProyectsMDB } from "../../models/proyects";

export const removeProyect = async (proyect: any): Promise<proyectDeletionData> => {
  // verify if the token was provided is correct
  const decodedToken = decodeToken(proyect?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { proyectHasDeleted: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }


  const proyectId = proyect?.proyectId;
  // finds the proyect id was provided to the delete process
  const proyectRes = await ProyectsMDB.findById(proyectId);

  // create an array for delete the proyect reference in all members
  const membersForQuery: any = proyectRes?.members;
  // create an array for delete the tasks in the proyect.
  const tasksForQuery: any = proyectRes?.tasks;

  // function which remve all tasks and tasks references was stored in the proyect
  const deleteOneTaskFromProyectsData = async (task: any): Promise<any> => {

    // finds the task that will be deleted
    const taksRes = await TasksMDB.findById(task);

    // create an array with the members id to remove the task reference
    const taskMembersForQuery: any = taksRes?.members;

    // function which remove the task reference in each member
    const deleteOneTaskMemberFromTasksData = async (member: any): Promise<any> => {
      // finds the user with the user id was provided and delte the task reference
      const userRes = await UserMDB.findByIdAndUpdate(member, { $pull: { tasks: `${task}` } });
      // if something's wrong trows the error
      if (userRes === null || userRes === undefined) {
        return { proyectHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
      }
    }

    //maps te task members from which the task reference will be deleted
    await Promise.all(taskMembersForQuery?.map(async (member: any): Promise<any> => {
      deleteOneTaskMemberFromTasksData(member);
    }));

    // once all the references of the task have been deleted, the task is removed
    const res = await TasksMDB.findByIdAndRemove(task);
    if (res === null || res === undefined) {
      // if something's wrong trows the error
      return { proyectHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
    }
  }

  //maps te tasks will be deleted
  await Promise.all(tasksForQuery?.map(async (task: any): Promise<any> => {
    deleteOneTaskFromProyectsData(task);
  }));

  // function to delete the proyect reference will be deleted
  const deleteOneProyectFromMembersUserData = async (member: any): Promise<any> => {
    const userId = member?.userId;
    const userRes = await UserMDB.findByIdAndUpdate(userId, { $pull: { proyects: `${proyectId}` } });
    // if something's wrong trows the error
    if (userRes === undefined || userRes === null) {
      return { taskHasDeleted: false, err: { errorCode: 6, errorDesc: "Eror was ocurred, try again" } };
    }
  }

  // maps the proyect members will be deleted the proyect reference
  await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
    await deleteOneProyectFromMembersUserData(member);
  }));

  // removes the proyect
  const res = await ProyectsMDB.findByIdAndRemove(proyectId);
  // if something's wrong trows the error
  if (res === undefined || res === null) {
    return { proyectHasDeleted: false, err: { errorCode: 6, errorDesc: "Error was ocurred, try again" } }
  }

  return { proyectHasDeleted: true }
}