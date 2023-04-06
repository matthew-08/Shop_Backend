import { PrismaPlugin } from '@pothos/plugin-prisma';
import { UserCart } from '@prisma/client';
import builder from '../builder';
import prisma from '../db';
import { shopItem } from './shopitem';

const cartItem = builder.prismaObject('CartItem', {
  fields: (t) => ({
    item: t.exposeID('itemId'),
    t: t.exposeBoolean('processed'),
  }),
});

const userCart = builder.prismaObject('UserCart', {
  fields: (t) => ({
    id: t.exposeID('id'),
    userItems: t.field({
      type: [shopItem],
      resolve: async (c) => {
        const getCart = await prisma.userCart.findUnique({
          where: {
            id: c.id,
          },
          include: {
            CartItem: {
              include: {
                item: {
                  select: {
                    name: true,
                    id: true,
                    img: true,
                    price: true,
                  },
                },
              },
            },
          },
        });
        const cleanData = getCart?.CartItem.map((item) => item.item);
        return clean;
      },
    }),
  }),
});

/* builder.queryFields((t) => ({
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
        return cart!;
      }
      return [{
        cartId: 3, itemId: 3, id: 3, processed: false,
      }];
    },
  }),
})); */

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
            CartItem: {
              include: {
                item: true,
              },
            },
          },
        });
        console.log(newCart.CartItem[0].item);
      }
      return {
        id: 1,
        userId: 2,
      };
    },
  }),
}));
