import { decodeToken } from "../../auth/decodeToken";
import { ProyectsMDB } from "../../models/proyects";
import { TaskInput, tasksCreationData, TasksMDB } from "../../models/tasks";
import { UserMDB } from "../../models/user";

export const addNewtask = async (newTaskItem: TaskInput): Promise<tasksCreationData> => {
  const decodedToken = decodeToken(newTaskItem?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { taskHasCreated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = newTaskItem?.proyectId;

  const newTask = new TasksMDB({
    proyectId: newTaskItem.proyectId,
    title: newTaskItem?.title,
    members: newTaskItem?.members,
    status: newTaskItem?.status,
    startAt: newTaskItem?.startAt,
    endsAt: newTaskItem?.endsAt,
  });

  const storeTask = await newTask.save();
  if (storeTask === null || storeTask === undefined) {
    return { taskHasCreated: false, err: { errorCode: 7, errorDesc: "Error occurred, please try again" } }
  }

  const res = await ProyectsMDB.findByIdAndUpdate(id, { $push: { tasks: `${storeTask?.id}` } });
  if (res === null || res === undefined) {
    return { taskHasCreated: false, err: { errorCode: 7, errorDesc: "Error occurred, please try again" } }
  }

  const userId = decodedToken.userId;
  const userRes = await UserMDB.findByIdAndUpdate(userId, { $push: { tasks: `${storeTask?.id}` } });
  if (userRes === null || userRes === undefined) {
    return { taskHasCreated: false, err: { errorCode: 7, errorDesc: "Error occurred, please try again" } }
  }

  return { taskHasCreated: true }
}