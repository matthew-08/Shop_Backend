import { ok } from 'assert';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import builder from '../builder';
import prisma from '../db';
import JWTSecretKey from '../utils/envVariables';

const user = builder.prismaObject('User', {
  description: 'Object type representing a user',
  fields: (t) => ({
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    id: t.exposeID('id'),
    token: t.field({
      type: 'String',
      resolve: async (parent, args, context) => {
        const token = await jwt.sign({ id: parent.id }, JWTSecretKey, { expiresIn: '1h' });
        return token;
      },
    }),
  }),
});

const UserRegisterInput = builder.inputType('UserRegisterInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

builder.mutationFields((t) => ({
  register: t.field({
    type: user,
    args: {
      input: t.arg({ type: UserRegisterInput, required: true }),
    },
    resolve: async (root, args) => {
      const { name, email, id } = await prisma.user.create({
        data: {
          email: args.input.email,
          name: args.input.name,
        },
      });
      return {
        name,
        email,
        id,
      };
    },
  }),
}));

const sessionCheckInput = builder.inputType('SessionCheckInput', {
  fields: (t) => ({
    token: t.string(),
  }),
});

builder.mutationFields((t) => ({
  checkForSession: t.field({
    type: user,
    args: {
      input: t.arg({ type: sessionCheckInput, required: true }),
    },
    resolve: async (root, args) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      console.log(args.input);
      const verifyUser = await jwt.verify(args.input.token!, JWTSecretKey);
      if (typeof verifyUser === 'string') {
        throw new Error('Unauthorized');
      } else {
        const getUser = await prisma.user.findFirstOrThrow({
          where: {
            id: verifyUser.id,
          },
        });
        return {
          ...getUser,
        };
      }
    },
  }),
}));
