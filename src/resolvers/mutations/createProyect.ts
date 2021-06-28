import { decodeToken } from "../../auth/decodeToken";
import { proyectCreationData, ProyectsForDB, ProyectsInput, ProyectsMDB } from "../../models/proyects";
import { UserMDB } from "../../models/user";

export const addProyect = async (proyect: ProyectsInput): Promise<proyectCreationData> => {
  const decodedToken = decodeToken(proyect?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { proyectHasCreated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }
  const addRole = proyect?.members[0];

  const newItemProyect: ProyectsForDB = {
    title: proyect?.title,
    members: [{ userId: addRole, role: 'admin' }],
    creator: proyect?.creator,
    startAt: proyect?.startAt,
    endsAt: proyect?.endsAt
  }

  const newProyect = new ProyectsMDB({
    title: newItemProyect?.title,
    members: newItemProyect?.members,
    creator: newItemProyect?.creator,
    startAt: newItemProyect?.startAt,
    endsAt: newItemProyect?.endsAt,
  });

  const storeProyect = await newProyect.save();
  if (storeProyect === null || storeProyect === undefined) {
    return { proyectHasCreated: false, err: { errorCode: 6, errorDesc: "Error has ocurred, try again" } }
  }

  const proyectId = storeProyect?.id;
  const id = newItemProyect?.creator;

  const res = await UserMDB.findByIdAndUpdate(id, { $push: { proyects: proyectId } });
  if (res === null || res === undefined) {
    console.log(res);
    return { proyectHasCreated: false, err: { errorCode: 4, errorDesc: "Error occurred, please try again" } }
  }

  return { proyectHasCreated: true }
}