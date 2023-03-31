import builder from '../builder';
import prisma from '../db';

const user = builder.prismaObject('User', {
  description: 'Object type representing a user',
  fields: (t) => ({
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    id: t.exposeID('id'),
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
      const newUser = await prisma.user.create({
        data: {
          email: args.input.email,
          name: args.input.name,
        },
      });
      return newUser;
    },
  }),
}));
