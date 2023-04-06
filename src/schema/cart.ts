import { PrismaPlugin } from '@pothos/plugin-prisma';
import { ShopItem, UserCart } from '@prisma/client';
import builder from '../builder';
import prisma from '../db';
import { shopItem } from './shopitem';

const cartItem = builder.prismaObject('CartItem', {
  fields: (t) => ({
    itemId: t.exposeID('itemId'),
    item: t.field({
      type: shopItem,
      resolve: async (c) => {
        const item = await prisma.shopItem.findUnique({
          where: {
            id: c.itemId,
          },
        });
        return item as ShopItem;
      },
    }),
    t: t.exposeBoolean('processed'),
  }),
});

const userCart = builder.prismaObject('UserCart', {
  fields: (t) => ({
    id: t.exposeID('id'),
    userItems: t.relation('CartItem'),
    /* userItems: t.field({
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
                    category: true,
                    description: true,
                    quantity: true,
                  },
                },
              },
            },
          },
        });
        const cleanData = getCart?.CartItem.map((item) => item.item);
        const createObject = cleanData?.map((item) => ({
          itemDescription: item.description,
        }));
        return createObject;
      },
    }), */
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
        return newCart;
      }
      const uCart = await prisma.userCart.findFirst({
        where: {
          userId: currentUserId,
        },
      });
      if (uCart) {
        await prisma.cartItem.create({
          data: {
            cartId: uCart.id,
            itemId: Number(args.itemToAdd),
          },
        });
      }
      return uCart as UserCart;
    },
  }),
}));
