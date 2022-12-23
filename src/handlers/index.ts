import { Request, Response, NextFunction } from 'express';
import { signTokens } from '../services/jwt';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/cookie';
import { LoginUserInput } from '../database/schmeas/Auth.schema';
import { credentials } from '@grpc/grpc-js';
import { UserClient } from '../proto/user_grpc_pb';
import bcrypt from 'bcrypt';
import { GetUserForLoginRequest, GetUserForLoginResponse } from '../proto/user_pb';

// intialize gRPC clients
const userClient = new UserClient('localhost:4080', credentials.createInsecure());

export const indexHandler = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'Auth server online!' });
};

export const loginHandler = async (req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log('  ---  POST /login');
  // first call the User service to see if the user exists
  const userRequest = new GetUserForLoginRequest();
  userRequest.setEmail(email);
  try {
    // get the user object from User service
    let user: any;
    userClient.getUserForLogin(userRequest, async (err, response) => {
      if (err) {
        console.error(err);
        return res.status(401).json('no user found with those credentials');
      } else {
        user = response.toObject();
        // check if passwords match
        if (!(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid log credentials' });
        }
        // remove the password field from the user object
        delete user.password;
        // sign tokens and send to client
        console.log(`  ---  User ${user.email} has been authenticated  ---`);
        const { accessToken, refreshToken } = await signTokens({ user: user });
        res.cookie('sb-access-token', accessToken, accessTokenCookieOptions);
        res.cookie('sb-refresh-token', refreshToken, refreshTokenCookieOptions);
        res.status(200).json({ message: 'sucessfully authenticated', token: accessToken });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'an error occured' });
  }
};
