import { decodeToken } from "../../auth/decodeToken";
import { TasksMDB, tasksUpdateData, TaskUpdateInput } from "../../models/tasks"

export const updateTask = async (task: TaskUpdateInput | any): Promise<tasksUpdateData> => {
  // verify if the token was provided is correct
  const decodedToken = decodeToken(task?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { taskHasUpdated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  // updates the task with the data was provied
  const taskId = task?.taskId;
  const taskRes = await TasksMDB.findByIdAndUpdate(taskId,
    {
      title: task?.title,
      status: task?.status,
      description: task?.description,
      startAt: task?.startAt,
      endsAt: task?.endsAt
    });
  // if something's wrong trows the error
  if (taskRes === undefined || taskRes === null) {
    return { taskHasUpdated: false, err: { errorCode: 5, errorDesc: "Error was ocurred, try again" } }
  }

  return { taskHasUpdated: true }
}