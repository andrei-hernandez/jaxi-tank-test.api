import { Schema, model } from "mongoose";
import { StringLiteralLike } from "typescript";
import { Error } from './error';

export interface Tasks {
  id: string;
  proyectId: string;
  title: string;
  members?: Array<TaskMember>;
  description?: string;
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
  description?: string;
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
  description?: string;
  members?: Array<String>;
  status: string;
  startAt?: string;
  endsAt?: string;
}

export interface TaskUpdateInput {
  token: string;
  taskId: string;
  title?: string;
  description?: string;
  members?: Array<string>;
  status?: string;
  startAt?: string;
  endsAt?: string;
}


export interface oneTaskInput {
  token: string;
  taskId: string;
}

export interface TasksMembersInput {
  token: string;
  taskId: string;
  memberEmail: string;
}

export interface TasksDeleteInput {
  token: string;
  taskId: string;
}

export interface tasksCreationData {
  taskHasCreated: boolean;
  err?: Error;
}

export interface oneTaskQueryData {
  task?: Tasks
  err?: Error
}
export interface taskMembersCreationData {
  memberHasAdded: boolean;
  err?: Error
}

export interface tasksUpdateData {
  taskHasUpdated: boolean;
  err?: Error;
}

export interface tasksDeletionData {
  taskHasDeleted: boolean;
  err?: Error
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
    description: { type: String, required: false },
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

