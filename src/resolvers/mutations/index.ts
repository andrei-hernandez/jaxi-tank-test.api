import { IResolvers } from "graphql-tools";
import { accountCreationData, User } from "../../models/user";
import { insertUser } from "./createUser";


const mutations: IResolvers = {
  Mutation: {
    createUser: async (_: void, { user }): Promise<accountCreationData> => {// okay this verify if the data is correct
      const newItemUser: User = {
        userName: user.userName,
        email: user.email,
        password: user.password,
        avatar: user.avatar
      }
      const cAccount: accountCreationData = await insertUser(newItemUser); //calls the method for inster a user and then return if is correct or no
      return cAccount;
    },
  }
}


export default mutations;

//god, this is sooooo strange kill me please ): 
//i cant't remember how it works ): 
//anyways the object _Mutation: {}_ contains all mutation resolvers