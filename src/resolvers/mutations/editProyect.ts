import { decodeToken } from "../../auth/decodeToken";
import { ProyectsMDB, proyectUpdateData } from "../../models/proyects";

export const updateProyect = async (proyect: any): Promise<proyectUpdateData> => {
  const decodedToken = decodeToken(proyect?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { proyectHasUpdated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }
  const id = proyect?.proyectId;
  const res = await ProyectsMDB.findByIdAndUpdate(id,
    {
      title: proyect?.title,
      startsAt: proyect?.startsAt,
      endsAt: proyect?.startsAt
    }
  );
  if (res === undefined || res === null) {
    return { proyectHasUpdated: false, err: { errorCode: 6, errorDesc: "Error was ocurred, try again" } }
  }

  return { proyectHasUpdated: true }
}