interface AuthType {
  accessToken: {
    expiresIn: number;
  };
  codeToken: {
    expiresIn: number;
  };
  refreshToken: {
    expiresIn: number;
  };
}

/**
 * Configuration of auth tokens.
 */
const auth: AuthType = {
  accessToken: {
    // The time in minutes before the access token expires.
    expiresIn: 60 * 60 * 1000000,
  },
  codeToken: {
    // The time in minutes before the code token expires.
    expiresIn: 5 * 60,
  },
  refreshToken: {
    // The time in minutes before the refresh token expires.
    expiresIn: 52560000,
  },
};

export default auth;
