/**
 * INTERFACE: IUserCredentials
 *
 * Defines the shape of a user's login credentials.
 * Used by LoginPage.login() and referenced in testData.json typing.
 * Replaces loose `{ username: string, password: string }` inline types.
 */
export interface IUserCredentials {
  username: string;
  password: string;
}
