import { Request } from 'express';
import getClient, { OAuthClient } from '../components/auth/oauth/getClient';
// import getDetail from '../components/auth/user/getDetail';
// import getFlatPermissionsFromUser from '../components/auth/permission/getFlatPermissionsFromUser';

interface User {
  id: number;
  permissions: string[];
}

export interface Context {
  client?: OAuthClient;
  user?: User;
}

export default () => async ({ req }: { req: Request }): Promise<Context> => {
  const token = req.get('authorization');

  const client = await getClient(token);
  // const currentUser = client && client.user ? await getDetail(client.user.id) : undefined;
  // const permissions = getFlatPermissionsFromUser(currentUser);

  return {
    client,
    // user: currentUser
    //   ? {
    //       id: currentUser.id,
    //       permissions,
    //     }
    //   : undefined,
  };
};
