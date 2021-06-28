import { ProyectsMDB } from './../../models/proyects';
import { decodeToken } from "../../auth/decodeToken";
import { TasksMDB } from '../../models/tasks';
import { UserMDB } from '../../models/user';

export const getTasksFromProyect = async (taskq: any): Promise<any> => {
  const decodedToken = decodeToken(taskq?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = taskq?.proyectId;
  const ProyectRes = await ProyectsMDB.findById(id);

  const tasksForQuery: any | Array<any> = ProyectRes?.tasks;
  const tasksRes: any | Array<any> = [];

  const getOneTask = async (task: string) => {
    const res = await TasksMDB.findById(task);

    const membersForQuery: any = res?.members;
    let membersRes: any[] = [];

    const getOneMember = async (member: any) => {
      const res: any = await UserMDB.findById(member, '_id email avatar');
      membersRes.push(res);
    }

    await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
      await getOneMember(member);
    }));

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

  await Promise.all(tasksForQuery?.map(async (task: any): Promise<any> => {
    await getOneTask(task);
  }));

  return { tasks: tasksRes }
}