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
  proyectId: string;
  title: string;
  members?: Array<TaskMember>;
  status: string;
  startAt?: string;
  endsAt?: string;
}

export interface TaskInput {
  token: string;
  proyectId: string;
  title: string;
  members?: Array<TaskMember>;
  status: string;
  startAt?: string;
  endsAt?: string;
}

export interface TaskMember {
  email: string;
  avatar: string;
  role: string;
}

