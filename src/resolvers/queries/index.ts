import { logIn } from "./accountLogIn";
import { IResolvers } from "graphql-tools";
import { oneTaskQuery } from "./getOneTask";
import { proyectsQuery } from "./getProyect";
import { sessionData } from "../../models/user";
import { contactsResolver } from "./getContacts";
import { oneProyectQuery } from "./getOneProyect";
import { getTasksFromUser } from "./getTasksFromUser";
import { UserContactData } from "../../models/contacts";
import { getTasksFromProyect } from "./getTasksFromProyect";
import { getTaskFromUserQueryInfo, oneTaskQueryData } from "../../models/tasks";
import { getProyectsQueryInfo, oneProyectQueryData } from "../../models/proyects";

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
    getOneTask: async (_: void, { task }): Promise<oneTaskQueryData | any> => {
      const gOneTask = await oneTaskQuery(task);
      console.log(gOneTask);
      return gOneTask;
    },
    getTasksFromUser: async (_: void, { token }): Promise<getTaskFromUserQueryInfo> => {
      const qTasksFromUser = await getTasksFromUser(token);
      return qTasksFromUser;
    },
    getTasksFromProyect: async (_: void, { taskq }): Promise<any> => {
      const qTasks = await getTasksFromProyect(taskq);
      return qTasks
    }
  }
};

export default queries;

// Query :{} contains all the query resolvers 