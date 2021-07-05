import { UserMDB } from "../../models/user";
import { decodeToken } from "../../auth/decodeToken";
import { proyectCreationData, ProyectsForDB, ProyectsInput, ProyectsMDB } from "../../models/proyects";

export const addProyect = async (proyect: ProyectsInput): Promise<proyectCreationData> => {
  // verify if the token was provided is correct
  const decodedToken = decodeToken(proyect?.token);
  // if something's wrong trows the error
  if (decodedToken === null || decodedToken === undefined) {
    return { proyectHasCreated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }
  const addRole = proyect?.members[0];

  //create a new object to store the proyect
  const newItemProyect: ProyectsForDB = {
    title: proyect?.title,
    members: [{ userId: addRole, role: 'admin' }],
    creator: proyect?.creator,
    startAt: proyect?.startAt,
    endsAt: proyect?.endsAt
  }

  // instance a new proyect with the mongoose model with the data was provided
  const newProyect = new ProyectsMDB({
    title: newItemProyect?.title,
    members: newItemProyect?.members,
    creator: newItemProyect?.creator,
    startAt: newItemProyect?.startAt,
    endsAt: newItemProyect?.endsAt,
  });

  // store the object in the proyects collection on the DB
  const storeProyect = await newProyect.save();
  // if something's wrong trows the error
  if (storeProyect === null || storeProyect === undefined) {
    return { proyectHasCreated: false, err: { errorCode: 6, errorDesc: "Error has ocurred, try again" } }
  }

  const proyectId = storeProyect?.id;
  const id = newItemProyect?.creator;
  // store the proyect id in the creator account proyects Array
  const res = await UserMDB.findByIdAndUpdate(id, { $push: { proyects: proyectId } });
  // if something's wrong trows the error
  if (res === null || res === undefined) {
    console.log(res);
    return { proyectHasCreated: false, err: { errorCode: 4, errorDesc: "Error occurred, please try again" } }
  }

  return { proyectHasCreated: true }
}