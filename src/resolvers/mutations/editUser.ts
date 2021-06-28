import { decodeToken } from "../../auth/decodeToken";
import { UserMDB, UserUpdateInput } from "../../models/user"

export const updateUser = async (user: UserUpdateInput): Promise<any> => {
  const decodedToken = decodeToken(user?.token);
  if (decodedToken === null || decodedToken === undefined) {
    return { userHasUpdated: false, err: { errorCode: 5, errorDesc: "Unexpected Token" } }
  }

  const id = decodedToken.userId;
  const userRes = await UserMDB.findByIdAndUpdate(id, { userName: user?.userName, avatar: user?.avatar });
  if (userRes === null || userRes === undefined) {
    return { userHasUpdated: false, err: { errorCode: 6, errorDesc: "An error has ocurred" } }
  }

  return { userHasUpdated: true }
}

