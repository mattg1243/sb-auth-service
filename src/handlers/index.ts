import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { USER_HOST } from '../app';
import { signTokens } from '../services/jwt';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/cookie';
import { LoginUserInput } from '../database/schmeas/Auth.schema';
import bcrypt from 'bcrypt';

export const indexHandler = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'Auth server online!' });
};

export const loginHandler = async (req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log('  ---  POST /login');
  // first call the User service to see if the user exists
  try {
    // get the user object from User service
    const response = await axios.get(USER_HOST + `/?email=${email}`);
    console.log(response.status);
    const user = response.data;
    // check if passwords match
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid log credentials' });
    }
    // sign tokens and send to client
    const { accessToken, refreshToken } = await signTokens(user);
    res.cookie('sb-access-token', accessToken, accessTokenCookieOptions);
    res.cookie('sb-refresh-token', refreshToken, refreshTokenCookieOptions);
    res.status(200).json({ message: 'sucessfully authenticates', user: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'an error occured' });
  }
};
