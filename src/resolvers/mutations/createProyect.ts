import { decodeToken } from "../../auth/decodeToken";
import { proyectCreationData, ProyectsForDB, ProyectsInput, ProyectsMDB } from "../../models/proyects";

export const addProyect = async (proyect: ProyectsInput): Promise<proyectCreationData> => {
  const decodedToken = decodeToken(proyect?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { proyectHasCreated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }
  const addRole = proyect?.members[0];

  const newItemProyect: ProyectsForDB = {
    title: proyect?.title,
    members: [{ email: addRole, role: 'admin' }],
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

  return { proyectHasCreated: true }
}