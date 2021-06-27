import { IResolvers } from "graphql-tools";
import { contactsCreationData, ContactsInput } from "../../models/contacts";
import { proyectCreationData, ProyectsInput } from "../../models/proyects";
import { accountCreationData, User } from "../../models/user";
import { addContact } from "./addContact";
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
    }
  }
}


export default mutations;

//god, this is sooooo strange kill me please ): 
//i cant't remember how it works ): 
//anyways the object _Mutation: {}_ contains all mutation resolvers