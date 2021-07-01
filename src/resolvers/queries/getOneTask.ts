import { decodeToken } from "../../auth/decodeToken";
import { oneTaskQueryData, TasksMDB } from "../../models/tasks";
import { UserMDB } from "../../models/user";

export const oneTaskQuery = async (task: any): Promise<oneTaskQueryData | any> => {
  const decodedToken = decodeToken(task?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const res = await TasksMDB.findById(task?.taskId);

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
    id: res?._id,
    proyectId: res?.proyectId,
    title: res?.title,
    members: membersRes,
    status: res?.status,
    startAt: res?.startAt,
    endsAt: res?.endsAt,
    createdAt: res?.createdAt,
    updatedAt: res?.updatedAt
  };

  console.log(taskObj)

  return { task: taskObj };
}