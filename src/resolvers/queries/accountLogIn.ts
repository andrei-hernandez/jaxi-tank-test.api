import { UserMDB, UserLogin, sessionData } from "../../models/user";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const avatarDefaultUri: string = "https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png";

export const logIn = async (userInput: UserLogin): Promise<sessionData> => {

  const User = await UserMDB.findOne({ email: `${userInput?.email}` }); //calls the mongoose model for a user to find the user email provided
  if (User === undefined || User === null) {
    return { userId: '-1', token: '', tokenExpiration: -1, err: { errorCode: 1, errorDesc: "Account don't exists" } }
  }

  const isEqual = await compare(userInput?.password, User?.password); //compare is a method from bcript to compare the encrypted password
  if (isEqual === undefined || isEqual === null || isEqual === false) {
    return { userId: '-1', token: '', tokenExpiration: -1, err: { errorCode: 2, errorDesc: "Incorrect password" } }
  }

  const token = sign({ userId: User?._id, email: User?.email }, 'somesupersecretkey', {//here create the jsw too the session and return the session data to the client
    expiresIn: '1d'//ignore the "somesupersecretkey"
  });

  return { userId: User?._id, avatar: User?.avatar ? User?.avatar : avatarDefaultUri, userName: User.userName, token: token, tokenExpiration: 1 }
}