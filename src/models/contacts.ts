import { Error } from './error';

export interface UserContact {
  email: string;
}

export interface UserContactData {
  _id: string;
  email: string;
  avatar?: string;
}

export interface ContactsInput {
  token: string;
  email: string;
}

export interface getContactsQueryInfo {
  contacts?: Array<string>;
  err?: Error
}

export interface contactsCreationData {
  contactHasCreated: boolean;
  err?: Error
}
