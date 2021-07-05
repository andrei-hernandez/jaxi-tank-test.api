import { UserMDB } from "../../models/user";
import { ProyectsMDB } from "../../models/proyects";
import { decodeToken } from "../../auth/decodeToken";
import { TaskInput, tasksCreationData, TasksMDB } from "../../models/tasks";

export const addNewtask = async (newTaskItem: TaskInput): Promise<tasksCreationData> => {
  // check's if the token was provided is valid
  const decodedToken = decodeToken(newTaskItem?.token);

  // if something's wrong trows the error
  if (decodedToken === null || decodedToken === undefined) {
    return { taskHasCreated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = newTaskItem?.proyectId;

  //creates a new object for store in the tasks collection on the database
  const newTask = new TasksMDB({
    proyectId: newTaskItem.proyectId,
    title: newTaskItem?.title,
    members: newTaskItem?.members,
    description: newTaskItem?.description,
    status: newTaskItem?.status,
    startAt: newTaskItem?.startAt,
    endsAt: newTaskItem?.endsAt,
  });

  // calls the sabe method in mongoose
  const storeTask = await newTask.save();
  // if something's wrong trows the error
  if (storeTask === null || storeTask === undefined) {
    return { taskHasCreated: false, err: { errorCode: 7, errorDesc: "Error occurred, please try again" } }
  }

  // calls the mongoose proyect model and store the task id in the tasks Array
  const res = await ProyectsMDB.findByIdAndUpdate(id, { $push: { tasks: `${storeTask?.id}` } });
  // if something's wrong trows the error
  if (res === null || res === undefined) {
    return { taskHasCreated: false, err: { errorCode: 7, errorDesc: "Error occurred, please try again" } }
  }

  //calls the member was created the task and adds the task id in her/him account data
  const userId = decodedToken.userId;
  const userRes = await UserMDB.findByIdAndUpdate(userId, { $push: { tasks: `${storeTask?.id}` } });
  // if something's wrong trows the error
  if (userRes === null || userRes === undefined) {
    return { taskHasCreated: false, err: { errorCode: 7, errorDesc: "Error occurred, please try again" } }
  }

  return { taskHasCreated: true }
}