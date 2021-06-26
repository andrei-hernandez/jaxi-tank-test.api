import { IResolvers } from "graphql-tools";
import { UserContactData } from "../../models/contacts";
import { sessionData } from "../../models/user";

import { logIn } from "./accountLogIn";
import { contactsResolver } from "./getContacts";

// Los resolvers de las operaciones de consulta para devolver información
const queries: IResolvers = {
  Query: {
    accountLogIn: async (_: void, { user }): Promise<sessionData> => { //here has logged the user 			
      const SessionData = await logIn(user);
      return SessionData;
    },
    getContacts: async (_: void, { token }): Promise<Array<UserContactData>> => {
      const qContacts = await contactsResolver(token);
      return qContacts;
    }
  }
};

export default queries;


//okay this file so extrange XDDDDD
//the object _Query_ contains all query resolvers so, all querys works diferent because i created it in diffrent days and i can't remember how it worksXDDD;