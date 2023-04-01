import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import JWTSecretKey from './envVariables';

interface JWTAuthPayload extends JwtPayload {
  id: string,
}

const verifyJWT = async (JWT: string) => {
  try {
    const verifyUser = await jwt.verify(JWT, JWTSecretKey);
    if (typeof verifyUser === 'object') {
      return verifyUser as JWTAuthPayload;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export default verifyJWT;
