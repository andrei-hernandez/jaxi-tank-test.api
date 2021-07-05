import { UserMDB } from "../../models/user";
import { decodeToken } from "../../auth/decodeToken";
import { getTaskFromUserQueryInfo, TasksMDB } from "../../models/tasks";

export const getTasksFromUser = async (token: string): Promise<getTaskFromUserQueryInfo> => {
  // verify if the token was provided is correct 
  const decodedToken = decodeToken(token);
  if (decodedToken === null || decodedToken === undefined) {
    return { err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  // finds the user data from the user id was be provied
  const userId = decodedToken.userId;
  const userRes: any = await UserMDB.findById(userId);

  // gets the tasks id's array will be mapped
  const tasksForQuery = userRes?.tasks;

  // creates a new array to store the tasks data
  let tasksRes: any = [];

  // function to gets all the task data 
  const getOneTask = async (task: string) => {
    // gets the task data with the task id was be provided
    const res = await TasksMDB.findById(task);

    // gets the members id's array will be mapped
    const membersForQuery: any = res?.members;

    // creates a new array to store all the tasks members data
    let membersRes: any[] = [];

    // function to gets all the members data
    const getOneMember = async (member: any) => {
      // gets the member data with the id was be provided
      const res: any = await UserMDB.findById(member, '_id email avatar');
      membersRes.push(res);
    }

    // maps the task members id arrray
    await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
      await getOneMember(member);
    }));

    // creates a new object with all the task data and push to tasks data array to response
    const taskObj = {
      id: res?.id,
      proyectId: res?.proyectId,
      title: res?.title,
      members: membersRes,
      status: res?.status,
      startAt: res?.startAt,
      endsAt: res?.endsAt,
      createdAt: res?.createdAt,
      updatedAt: res?.updatedAt
    }

    tasksRes.push(taskObj);
  }

  // maps the tasks id array
  await Promise.all(tasksForQuery?.map(async (task: any): Promise<any> => {
    await getOneTask(task);
  }));

  return { tasks: tasksRes }
}