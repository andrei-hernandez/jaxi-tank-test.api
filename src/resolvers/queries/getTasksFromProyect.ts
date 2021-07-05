import { UserMDB } from '../../models/user';
import { TasksMDB } from '../../models/tasks';
import { decodeToken } from '../../auth/decodeToken';
import { ProyectsMDB } from './../../models/proyects';

export const getTasksFromProyect = async (taskq: any): Promise<any> => {
  // verify if the token was provided is correct
  const decodedToken = decodeToken(taskq?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  // gets the proyect with the proyect id was provided
  const id = taskq?.proyectId;
  const ProyectRes = await ProyectsMDB.findById(id);

  // gets the tasks id array will be maped
  const tasksForQuery: any | Array<any> = ProyectRes?.tasks;

  // create a new array to store the tasks data
  const tasksRes: any | Array<any> = [];

  // function to gets a single task
  const getOneTask = async (task: string) => {
    // gets the task with the task id was provided
    const res = await TasksMDB.findById(task);

    // gets the task members id array will be maped
    const membersForQuery: any = res?.members;

    // create a new array to store the task data
    let membersRes: any[] = [];

    // function to gets the task member data
    const getOneMember = async (member: any) => {
      // gets the member data with the id was be provided and push to members response aray
      const res: any = await UserMDB.findById(member, '_id email avatar');
      membersRes.push(res);
    }

    // maps the task members id array
    await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
      await getOneMember(member);
    }));

    // creates a new object with all the data in a task
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

  // maps the tasks id array to gets the task id data
  await Promise.all(tasksForQuery?.map(async (task: any): Promise<any> => {
    await getOneTask(task);
  }));

  return { tasks: tasksRes }
}