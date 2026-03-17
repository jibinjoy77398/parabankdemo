/**
 * INTERFACE: IRegistrationDetails
 *
 * Defines the exact shape of a registration form submission.
 * Replaces the loose `Record<string, string>` used in RegisterPage.fillRegistrationForm().
 * This gives full IDE autocomplete and compile-time checks when passing form data.
 */
export interface IRegistrationDetails {
  firstName:       string;
  lastName:        string;
  address:         string;
  city:            string;
  state:           string;
  zipCode:         string;
  phoneNumber:     string;
  ssn:             string;
  username:        string;
  password:        string;
  confirmPassword: string;
}
