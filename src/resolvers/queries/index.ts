import { IResolvers } from "graphql-tools";
import { UserContactData } from "../../models/contacts";
import { getProyectsQueryInfo, oneProyectQueryData } from "../../models/proyects";
import { getTaskFromUserQueryInfo } from "../../models/tasks";
import { sessionData } from "../../models/user";

import { logIn } from "./accountLogIn";
import { contactsResolver } from "./getContacts";
import { oneProyectQuery } from "./getOneProyect";
import { proyectsQuery } from "./getProyect";
import { getTasksFromProyect } from "./getTasksFromProyect";
import { getTasksFromUser } from "./getTasksFromUser";

const queries: IResolvers = {
  Query: {
    accountLogIn: async (_: void, { user }): Promise<sessionData> => { //here has logged the user 			
      const SessionData = await logIn(user);
      return SessionData;
    },
    getContacts: async (_: void, { token }): Promise<Array<UserContactData>> => {
      const qContacts = await contactsResolver(token);
      return qContacts;
    },
    getProyects: async (_: void, { token }): Promise<getProyectsQueryInfo> => {
      const qProyects = await proyectsQuery(token);
      return qProyects;
    },
    getOneProyect: async (_: void, { proyect }): Promise<oneProyectQueryData | any> => {
      const gOneProyect = await oneProyectQuery(proyect);
      return gOneProyect;
    },
    getTasksFromUser: async (_: void, { token }): Promise<getTaskFromUserQueryInfo> => {
      const qTasksFromUser = await getTasksFromUser(token);
      return qTasksFromUser;
    },
    getTasksFromProyect: async (_: void, { taskq }): Promise<any> => {
      const qTasks = getTasksFromProyect(taskq);
      return qTasks
    }
  }
};

export default queries;
