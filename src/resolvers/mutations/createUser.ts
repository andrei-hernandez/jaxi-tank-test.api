
import { genSalt, hash } from 'bcrypt';
import { accountCreationData, User, UserMDB } from '../../models/user';

export const insertUser = async (NewItemUser: User): Promise<accountCreationData> => {

  const avatarDefaultUri: string = "https://www.pikpng.com/pngl/b/326-3261783_person-icon-default-user-image-jpg-clipart.png";
  // if an avatar was not provided adds a default avatar
  if (NewItemUser?.avatar === "" || NewItemUser?.avatar === null || NewItemUser?.avatar === undefined) {
    NewItemUser.avatar = avatarDefaultUri;
  }

  // checks if the account exists
  const IfAccountExists = await UserMDB.findOne({ email: `${NewItemUser.email}` }); //calls the mongoose model for a user to find the user email was provided
  if (IfAccountExists) {
    return { hasCreated: false, err: { errorCode: 3, errorDesc: "Account Exists" } }
  }

  const saltRounds = 10;//store the rounds to encrypt the password

  await genSalt(saltRounds, (err, salt): void => {    //gen salt from the saltRounds
    hash(NewItemUser.password, salt, (err, hash): void => {//gen hash from the salt rounds and the plain text password
      const encPass = hash.toString(); //store the hased password

      let newUser = new UserMDB({ //instance a User from mongoose model and strore the data was provided for create user
        userName: NewItemUser.userName,
        email: NewItemUser.email,
        avatar: NewItemUser.avatar,
        password: encPass
      });
      //calls the mongoose method .save for store a document(user), the register in a noSQL DB is called "Document"
      newUser.save(function (err) {
        if (err) return console.log(err);
        // saved!
      });
    });
  });
  return { hasCreated: true }
}
