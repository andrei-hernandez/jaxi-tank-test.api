import { decodeToken } from "../../auth/decodeToken";
import { TasksMDB, tasksUpdateData, TaskUpdateInput } from "../../models/tasks"

export const updateTask = async (task: TaskUpdateInput | any): Promise<tasksUpdateData> => {
  const decodedToken = decodeToken(task?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { taskHasUpdated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const taskId = task?.taskId;
  const taskRes = await TasksMDB.findByIdAndUpdate(taskId,
    {
      title: task?.title,
      members: task?.members,
      status: task?.status,
      description: task?.description,
      startAt: task?.startAt,
      endsAt: task?.endsAt
    });
  if (taskRes === undefined || taskRes === null) {
    return { taskHasUpdated: false, err: { errorCode: 5, errorDesc: "Error was ocurred, try again" } }
  }

  return { taskHasUpdated: true }
}