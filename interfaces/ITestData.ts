import { IUserCredentials }    from './IUserCredentials';
import { IRegistrationDetails } from './IRegistrationDetails';

/**
 * INTERFACE: ITestData
 *
 * Describes the complete shape of data/testData.json.
 * Imported in tests and global-setup so TypeScript can validate
 * that every field access is valid at compile time.
 */
export interface ITestData {
  validUser:           IUserCredentials;
  invalidUser:         IUserCredentials;
  registrationDetails: IRegistrationDetails;
}
