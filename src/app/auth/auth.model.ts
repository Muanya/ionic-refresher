export class User {
  constructor(
    public id: string,
    public email: string,
    private _token?: string,
    private _refreshToken?: string,
    private _tokenExpirationTime?: Date
  ) {}

  public get token(): string | undefined {
    return this._token;
  }

  public get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  public get isValid(): boolean {
    return this.tokenValidDuration > 0;
  }

  public get tokenValidDuration(): number {
    if (!this._tokenExpirationTime || !this._token) {
      return 0;
    }

    return Math.max(
      0,
      this._tokenExpirationTime.getTime() - new Date().getTime()
    );
  }

  public refresh(token: string, refreshToken: string, expiresIn: Date) {
    this._token = token;
    this._refreshToken = refreshToken;
    this._tokenExpirationTime = expiresIn;
  }
}

export interface AuthResponseData {
  idToken: string; //A Firebase Auth ID token for the authenticated user.
  email: string; //The email for the authenticated user.
  refreshToken: string; //A Firebase Auth refresh token for the authenticated user.
  expiresIn: string; //	The number of seconds in which the ID token expires.
  localId: string; //The uid of the authenticated user.
  registered?: boolean;
}

export interface RefreshResponseData {
  access_token: string;
  expires_in: string;
  id_token: string;
  project_id: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
}
