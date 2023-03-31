import builder from '../builder';
import prisma from '../db';

builder.prismaObject('User', {
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

builder.mutationField('register');
