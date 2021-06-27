import { decodeToken } from "../../auth/decodeToken";
import { ProyectsMDB } from "../../models/proyects";
import { UserMDB } from "../../models/user";
import { TasksMDB } from "../../models/tasks";

export const proyectsQuery = async (token: string): Promise<any> => {
  const decodedToken = decodeToken(token);
  if (decodedToken === null || decodedToken === undefined) {
    return { proyectHasCreated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = decodedToken.userId;

  const userQ = await UserMDB.findById(id);

  const ProyectsArray: Array<any> | any = userQ?.proyects;

  let proyects: Array<any> = [];

  const getOneProyect = async (proyect: string) => {
    const res: any = await ProyectsMDB.findById(proyect);
    const creatorId: any = res?.creator;

    //gets the proyect creator 
    const creatorRes: any = await UserMDB.findById(creatorId, '_id userName email avatar');

    let proyectObj = {
      id: res?.id,
      title: res?.title,
      members: res?.members,
      tasks: res?.tasks,
      creator: {
        id: creatorRes?.id,
        userName: creatorRes?.userName,
        email: creatorRes?.email,
        avatar: creatorRes?.avatar
      },
      startAt: res?.startAt,
      endsAt: res?.endsAt,
      createdAt: res?.createdAt,
      updatedAt: res?.updatedAt
    };


    //gets the members into a proyect
    let membersForQuery = proyectObj.members;
    let membersRes: any = [];

    const getOneMember = async (member: any) => {
      const id = member?.userId;
      const res = await UserMDB.findById(id, '_id userName email avatar');
      const memberObj = {
        id: res?.id,
        userName: res?.userName,
        email: res?.email,
        avatar: res?.avatar,
        role: member?.role
      }
      membersRes.push(memberObj);
    }

    await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
      await getOneMember(member);
    }));

    proyectObj.members = membersRes;


    //gets the tasks into a proyect
    let tasksForQuery = proyectObj?.tasks;
    let tasksRes: any = [];
    const getOneTask = async (task: any): Promise<any> => {
      const res = await TasksMDB.findById(task);

      //get the task member
      const taskMembersForQuery: any = res?.members;
      let taskMembersRes: any = [];
      const getOneTaskMember = async (memberTask: any): Promise<any> => {
        const res = await UserMDB.findById(memberTask, '_id userName email avatar');
        taskMembersRes.push(res);
      }

      await Promise.all(taskMembersForQuery?.map(async (memberTask: any): Promise<any> => {
        await getOneTaskMember(memberTask);
      }));

      const tasksObj = {
        id: res?.id,
        members: taskMembersRes,
        proyectId: res?.proyectId,
        title: res?.title,
        status: res?.status,
        startAt: res?.startAt,
        endsAt: res?.endsAt,
        createdAt: res?.createdAt,
        updatedAt: res?.updatedAt
      }

      tasksRes.push(tasksObj);
    }

    await Promise.all(tasksForQuery?.map(async (task: any): Promise<any> => {
      await getOneTask(task);
    }));
    proyectObj.tasks = tasksRes;
    proyects.push(proyectObj);
  }

  await Promise.all(ProyectsArray?.map(async (proyect: any): Promise<any> => {
    await getOneProyect(proyect);
  }));

  return { proyects }
}