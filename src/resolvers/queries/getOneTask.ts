import { UserMDB } from "../../models/user";
import { decodeToken } from "../../auth/decodeToken";
import { oneTaskQueryData, TasksMDB } from "../../models/tasks";

export const oneTaskQuery = async (task: any): Promise<oneTaskQueryData | any> => {
  // verify if the token was provided is correct
  const decodedToken = decodeToken(task?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const res = await TasksMDB.findById(task?.taskId);

  // creates a new array will be maped for gets the members data
  const membersForQuery: any = res?.members;
  let membersRes: any[] = [];

  // function to push the members data in the members response array
  const getOneMember = async (member: any) => {
    const res: any = await UserMDB.findById(member, '_id email avatar');
    membersRes.push(res);
  }

  // maps the array with the members id
  await Promise.all(membersForQuery?.map(async (member: any): Promise<any> => {
    await getOneMember(member);
  }));

  // creates the task object to resolve the query
  const taskObj = {
    id: res?._id,
    proyectId: res?.proyectId,
    title: res?.title,
    members: membersRes,
    description: res?.description,
    status: res?.status,
    startAt: res?.startAt,
    endsAt: res?.endsAt,
    createdAt: res?.createdAt,
    updatedAt: res?.updatedAt
  };

  return { task: taskObj };
}