export interface AuthParams {
  email: string
  password: string
}

export interface Authentication {
  auth: (authenticationParams: AuthParams) => Promise<string>
}
