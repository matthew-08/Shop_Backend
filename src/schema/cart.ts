import { PrismaPlugin } from '@pothos/plugin-prisma';
import builder from '../builder';
import prisma from '../db';

const userCart = builder.prismaObject('UserCart', {
  fields: (t) => ({
    cart: t.relation('CartItem'),
  }),
});

builder.queryFields((t) => ({
  userCart: t.prismaField({
    args: {
      userId: t.arg({ required: true, type: 'String' }),
    },
    type: ['CartItem'],
    resolve: async (query, parent, args) => {
      const cart = prisma.userCart.findFirst({
        where: {
          userId: Number(args.userId),
        },
      });
      if (cart) {
        return cart;
      }
    },
  }),
}));

builder.mutationFields((t) => ({
  addToCart: t.field({
    args: {
      userId: t.arg({ required: true, type: 'String' }),
      itemToAdd: t.arg({ required: true, type: 'String' }),
    },
    type: userCart,
    resolve: async (root, args) => {
      const currentUserId = Number(args.userId);
      const cartExists = await prisma.userCart.count({
        where: {
          userId: currentUserId,
        },
      });
      if (!cartExists) {
        const newCart = await prisma.userCart.create({
          data: {
            userId: currentUserId,
            CartItem: {
              create: {
                itemId: Number(args.itemToAdd),
              },
            },
          },
          include: {
            CartItem: true,
          },
        });
        return newCart;
      }
    },
  }),
}));
