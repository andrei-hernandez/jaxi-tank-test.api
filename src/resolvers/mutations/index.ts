import { IResolvers } from "graphql-tools";
import { contactsCreationData, ContactsInput } from "../../models/contacts";
import { membersCreationData, MembersInput, proyectCreationData } from "../../models/proyects";
import { accountCreationData, User } from "../../models/user";
import { addContact } from "./addContact";
import { addNewMember } from "./addMember";
import { addProyect } from "./createProyect";
import { insertUser } from "./createUser";


const mutations: IResolvers = {
  Mutation: {
    createUser: async (_: void, { user }): Promise<accountCreationData> => {// okay this verify if the data is correct
      const newItemUser: User = {
        userName: user?.userName,
        email: user?.email,
        password: user?.password,
        avatar: user?.avatar
      }
      const cAccount: accountCreationData = await insertUser(newItemUser); //calls the method for inster a user and then return if is correct or no
      return cAccount;
    },
    createContact: async (_: void, { contact }): Promise<contactsCreationData> => {
      const newItemContact: ContactsInput = {
        token: contact?.token,
        email: contact?.email
      }
      const cContact = await addContact(newItemContact);
      return cContact
    },
    createProyect: async (_: void, { proyect }): Promise<proyectCreationData> => {
      const cProyect = await addProyect(proyect);
      return cProyect
    },
    addMember: async (_: void, { member }): Promise<membersCreationData> => {
      const newItemMember: MembersInput = {
        token: member?.token,
        proyectId: member?.proyectId,
        email: member?.email,
        role: member?.role,
      }
      const aMember = await addNewMember(newItemMember);
      return aMember;
    }
  }
}


export default mutations;
//anyways the object _Mutation: {}_ contains all mutation resolvers