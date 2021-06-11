export interface UpdateAccessTokenModel {
  accountId: string
  token: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (
    updateAccessTokenModel: UpdateAccessTokenModel
  ) => Promise<void>
}
