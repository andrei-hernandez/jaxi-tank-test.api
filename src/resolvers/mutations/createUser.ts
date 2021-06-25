
import { accountCreationData, User, UserMDB } from '../../models/user';
import { genSalt, hash } from 'bcrypt';

export const insertUser = async (NewItemUser: User): Promise<accountCreationData> => {

  const IfAccountExists = await UserMDB.findOne({ email: `${NewItemUser.email}` }); //calls the mongoose model for a user to find the user email provided
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
