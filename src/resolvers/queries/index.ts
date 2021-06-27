import { IResolvers } from "graphql-tools";
import { UserContactData } from "../../models/contacts";
import { sessionData } from "../../models/user";

import { logIn } from "./accountLogIn";
import { contactsResolver } from "./getContacts";

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