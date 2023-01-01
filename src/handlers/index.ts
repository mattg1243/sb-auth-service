import { Request, Response, NextFunction } from 'express';
import { signTokens } from '../services/jwt';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/cookie';
import { LoginUserInput } from '../database/schmeas/Auth.schema';
import { credentials } from '@grpc/grpc-js';
import { UserClient } from '../proto/user_grpc_pb';
import bcrypt from 'bcrypt';
import { GetUserForLoginRequest, GetUserForLoginResponse } from '../proto/user_pb';
import axios from 'axios';

// intialize gRPC clients
const USER_GRPC_HOST = process.env.USER_GRPC_HOST || 'http://localhost';
const USER_GRPC_PORT = process.env.USER_GRPC_PORT || '4080';
const USER_HTTP_HOST = process.env.USER_HTTP_HOST || 'http://localhost';
const USER_HTTP_PORT = process.env.USER_HTTP_PORT || '8080';
const userClient = new UserClient(`${USER_GRPC_HOST}:${USER_GRPC_PORT}`, credentials.createInsecure());

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

    const responseFromUserService = await axios.post(`${USER_HTTP_HOST}:${USER_HTTP_PORT}/login`, { email });
    const user = responseFromUserService.data;
    console.log('password from db: \n', user.password, '\npassword from request: \n', password);
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
    res.status(200).json({ message: 'sucessfully authenticated', token: accessToken, user: user });

    // THIS IS THE GRPC WAY which will be implemented when we pay for private servies
    // let user: any;
    // userClient.getUserForLogin(userRequest, async (err, response) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(401).json('no user found with those credentials');
    //   } else {
    //     user = response.toObject();
    //     // check if passwords match
    //     if (!(await bcrypt.compare(password, user.password))) {
    //       return res.status(401).json({ message: 'Invalid log credentials' });
    //     }
    //     // remove the password field from the user object
    //     delete user.password;
    //     // sign tokens and send to client
    //     console.log(`  ---  User ${user.email} has been authenticated  ---`);
    //     const { accessToken, refreshToken } = await signTokens({ user: user });
    //     res.cookie('sb-access-token', accessToken, accessTokenCookieOptions);
    //     res.cookie('sb-refresh-token', refreshToken, refreshTokenCookieOptions);
    //     res.status(200).json({ message: 'sucessfully authenticated', token: accessToken, user: user });
    //   }
    // });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'an error occured' });
  }
};
