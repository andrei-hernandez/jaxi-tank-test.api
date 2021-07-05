import { addNewtask } from "./addTask";
import { updateUser } from "./editUser";
import { updateTask } from "./editTask";
import { insertUser } from "./createUser";
import { removeTask } from "./deleteTask";
import { addContact } from "./addContact";
import { IResolvers } from "graphql-tools";
import { addNewMember } from "./addMember";
import { addProyect } from "./createProyect";
import { updateProyect } from "./editProyect";
import { removeProyect } from "./deleteProyect";
import { removeContact } from "./deleteContact";
import { createTaskMember } from "./addTaskMember";
import { accountCreationData, acountUpdateData, User } from "../../models/user";
import { contactsCreationData, contactsDeletionData, ContactsInput } from "../../models/contacts";
import { TaskInput, taskMembersCreationData, tasksCreationData, tasksDeletionData, tasksUpdateData } from "../../models/tasks";
import { membersCreationData, MembersInput, proyectCreationData, proyectDeletionData, proyectUpdateData } from "../../models/proyects";


const mutations: IResolvers = {
  Mutation: {
    createUser: async (_: void, { user }): Promise<accountCreationData> => {// okay this verify if the data is correct
      const newItemUser: User = {
        userName: user?.userName,
        email: user?.email,
        password: user?.password,
        avatar: user?.avatar
      };
      const cAccount: accountCreationData = await insertUser(newItemUser); //calls the method for inster a user and then return if is correct or no
      return cAccount;
    },
    editUser: async (_: void, { user }): Promise<acountUpdateData | any> => {
      const uAccount = updateUser(user);
      return uAccount;
    },
    createContact: async (_: void, { contact }): Promise<contactsCreationData> => {
      const newItemContact: ContactsInput = {
        token: contact?.token,
        email: contact?.email
      };
      const cContact = await addContact(newItemContact);
      return cContact;
    },
    deleteContact: async (_: void, { contact }): Promise<contactsDeletionData> => {
      const rContact = await removeContact(contact);
      return rContact;
    },
    createProyect: async (_: void, { proyect }): Promise<proyectCreationData> => {
      const cProyect = await addProyect(proyect);
      return cProyect;
    },
    editProyect: async (_: void, { proyect }): Promise<proyectUpdateData> => {
      const uProyect = await updateProyect(proyect);
      return uProyect;
    },
    deleteProyect: async (_: void, { proyect }): Promise<proyectDeletionData> => {
      const rProyect = await removeProyect(proyect);
      return rProyect;
    },
    addMember: async (_: void, { member }): Promise<membersCreationData> => {
      const newItemMember: MembersInput = {
        token: member?.token,
        proyectId: member?.proyectId,
        email: member?.email,
        role: member?.role,
      };
      const aMember = await addNewMember(newItemMember);
      return aMember;
    },
    addTask: async (_: void, { task }): Promise<tasksCreationData> => {
      const newTaskItem: TaskInput = {
        token: task?.token,
        proyectId: task?.proyectId,
        title: task?.title,
        members: task?.members,
        description: task?.description,
        status: task?.status,
        startAt: task?.startAt,
        endsAt: task?.endsAt
      };
      const cTask = await addNewtask(newTaskItem);
      return cTask;
    },
    addTaskMember: async (_void, { member }): Promise<taskMembersCreationData> => {
      const aMember = createTaskMember(member);
      return aMember;
    },
    editTask: async (_: void, { task }): Promise<tasksUpdateData> => {
      const uTask = await updateTask(task);
      return uTask;
    },
    deleteTask: async (_: void, { task }): Promise<tasksDeletionData> => {
      const dTask = await removeTask(task);
      return dTask;
    }
  }
}


export default mutations;
// the object _Mutation: {}_ contains all mutation resolvers