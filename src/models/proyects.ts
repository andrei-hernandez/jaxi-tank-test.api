import { Schema, model } from "mongoose";
import { Tasks } from "./tasks";
import { Error } from "./error";

export interface ProyectsData {
  _id: string;
  title: string;
  creator: string;
  members: Array<ProyectMembers>;
  tasks?: Array<Tasks>;
  startAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Proyect {
  title: string;
  creator: string;
  members: Array<ProyectMembers>;
  tasks?: Array<Tasks>;
  startAt: string;
  endsAt: string;
}

export interface ProyectMembers {
  userId: string;
  email?: string;
  avatar?: string;
  role: string;
}

export interface ProyectsInput {
  token: string;
  title: string;
  members: Array<string>
  creator: string;
  startAt: string;
  endsAt: string;
}

export interface ProyectsForDB {
  title: string;
  members: Array<ProyectMembers>
  creator: string;
  startAt: string;
  endsAt: string;
}

export interface MembersInput {
  token: string;
  proyectId: string;
  email: string;
  role: string;
}

export interface getProyectsQueryInfo {
  proyects?: Array<ProyectsData>;
  err?: Error;
}

export interface membersCreationData {
  memberHasAdded: boolean;
  err?: Error;
}

export interface proyectCreationData {
  proyectHasCreated: boolean;
  err?: Error;
}

const proyectSchema = new Schema<Proyect>(
  {
    title: { type: String, required: true },
    creator: { type: String, required: true },
    members: { type: Array, required: true },
    tasks: { type: Array, required: false },
    startAt: { type: String, required: false },
    endsAt: { type: String, required: false }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const ProyectsMDB = model<Proyect>('proyect', proyectSchema);