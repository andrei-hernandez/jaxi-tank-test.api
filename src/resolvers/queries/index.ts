
import { IResolvers } from "graphql-tools";
import { sessionData, UserMDB } from "../../models/user";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { decodeToken } from "../../auth/decodeToken";


// Los resolvers de las operaciones de consulta para devolver información
const queries: IResolvers = {
  Query: {
    accountLogIn: async (_: void, { user }): Promise<sessionData> => { //here has logged the user 			
      const User = await UserMDB.findOne({ email: `${user.email}` }); //calls the mongoose model for a user to find the user email provided
      if (User === undefined || User === null) {
        return { userId: '-1', token: '', tokenExpiration: -1, err: { errorCode: 1, errorDesc: "Account don't exists" } }
      }
      // @ts-ignore: Object is possibly 'null'. //ignore this please, i can't find another method u.u'
      const isEqual = await compare(user.password, User.password); //compare is a method from bcript to compare the encrypted password
      if (isEqual === undefined || isEqual === null || isEqual === false) {
        return { userId: '-1', token: '', tokenExpiration: -1, err: { errorCode: 2, errorDesc: "Incorrect password" } }
      }
      const token = sign({ userId: user._id, email: user.email }, 'somesupersecretkey', {//here create the jsw too the session and return the session data to the client
        expiresIn: '1h'//ignore the "somesupersecretkey"
      });
      // @ts-ignore: Object is possibly 'null'.
      return { userId: User._id, token: token, tokenExpiration: 1 }
    },
  }
};

export default queries;


//okay this file so extrange XDDDDD
//the object _Query_ contains all query resolvers so, all querys works diferent because i created it in diffrent days and i can't remember how it worksXDDD;