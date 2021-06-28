import { Schema, model } from "mongoose";
import { Error } from './error';

export interface Tasks {
  _id: string;
  proyectId: string;
  title: string;
  members?: Array<TaskMember>;
  status: string;
  startAt?: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskData {
  proyectId?: string;
  title: string;
  members?: Array<string>;
  status: string;
  startAt?: string;
  endsAt?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface TaskMember {
  id: string;
  email: string;
  avatar: string;
}

export interface TaskInput {
  token: string;
  proyectId: string;
  title: string;
  members?: Array<String>;
  status: string;
  startAt?: string;
  endsAt?: string;
}

export interface TaskUpdateInput {
  token: string;
  taskId: string;
  title?: string;
  members?: Array<string>;
  status?: string;
  startAt?: string;
  endsAt?: string;
}

export interface tasksCreationData {
  taskHasCreated: boolean;
  err?: Error;
}

export interface tasksUpdateData {
  taskHasUpdated: boolean;
  err?: Error;
}

export interface getTaskFromUserQueryInfo {
  tasks?: Array<Tasks>
  err?: Error
}

export const tasksSchema = new Schema<TaskData>(
  {
    proyectId: { type: String, required: true },
    title: { type: String, required: true },
    members: { type: Array, required: false },
    status: { type: String, required: true },
    startAt: { type: String, required: false },
    endsAt: { type: String, required: false }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const TasksMDB = model<TaskData>('tasks', tasksSchema);

