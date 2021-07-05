import { UserMDB } from "../../models/user";
import { TasksMDB } from "../../models/tasks";
import { decodeToken } from "../../auth/decodeToken";
import { getProyectsQueryInfo, ProyectsMDB } from "../../models/proyects";

export const proyectsQuery = async (token: string): Promise<getProyectsQueryInfo> => {
  // verify if the token was provided is correct
  const decodedToken = decodeToken(token);
  if (decodedToken === null || decodedToken === undefined) {
    return { err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = decodedToken.userId;

  const userQ = await UserMDB.findById(id);

  // gets all the proyects in the user
  const ProyectsArray: Array<any> | any = userQ?.proyects;

  // creates proyect array to store all the proyects data
  let proyects: Array<any> = [];

  // function to get one proyect
  const getOneProyect = async (proyect: string) => {
    const res: any = await ProyectsMDB.findById(proyect);
    const creatorId: any = res?.creator;

    //gets the proyect creator 
    const creatorRes: any = await UserMDB.findById(creatorId, '_id userName email avatar');

    // creates a new proyect object to push in the proyects array
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

    // creates a new array with all members data
    let membersRes: any = [];

    const getOneMember = async (member: any) => {
      // gets the member data and push in the members array to response
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

    // maps the members id array
    await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
      await getOneMember(member);
    }));

    // sets the member data array to the proyect objet to the response
    proyectObj.members = membersRes;


    //gets the tasks into a proyect
    let tasksForQuery = proyectObj?.tasks;

    //creates a new array to store the task data
    let tasksRes: any = [];

    //function to gets the task data
    const getOneTask = async (task: any): Promise<any> => {
      // gets the tasks data
      const res = await TasksMDB.findById(task);

      //get the task member array
      const taskMembersForQuery: any = res?.members;

      // create a new array to store all the members data
      let taskMembersRes: any = [];

      //function to get the member info and push into the members data array
      const getOneTaskMember = async (memberTask: any): Promise<any> => {
        const res = await UserMDB.findById(memberTask, '_id userName email avatar');
        taskMembersRes.push(res);
      }

      // maps the members id array in the task
      await Promise.all(taskMembersForQuery?.map(async (memberTask: any): Promise<any> => {
        await getOneTaskMember(memberTask);
      }));

      // create a new object with all the task data to push in the tasks array in the proyect object to response
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

    // maps the tasks id array in a proyect
    await Promise.all(tasksForQuery?.map(async (task: any): Promise<any> => {
      await getOneTask(task);
    }));
    proyectObj.tasks = tasksRes;
    proyects.push(proyectObj);
  }

  // maps the proyects id array in a user
  await Promise.all(ProyectsArray?.map(async (proyect: any): Promise<any> => {
    await getOneProyect(proyect);
  }));

  return { proyects }
}