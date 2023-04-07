import { PrismaPlugin } from '@pothos/plugin-prisma';
import { ShopItem, UserCart } from '@prisma/client';
import builder from '../builder';
import prisma from '../db';
import { shopItem } from './shopitem';

const cartItem = builder.prismaObject('CartItem', {
  fields: (t) => ({
    cartSpecificId: t.exposeID('itemId'),
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

const addToCartInput = builder.inputType('AddToCartInput', {
  fields: (t) => ({
    userId: t.string({ required: true }),
    itemToAdd: t.string({ required: true }),
  }),
});

builder.mutationFields((t) => ({
  addToCart: t.field({
    args: {
      addToCartInput: t.arg({ required: true, type: addToCartInput }),
    },
    type: userCart,
    resolve: async (root, args) => {
      const { itemToAdd, userId } = args.addToCartInput;
      const currentUserId = Number(userId);
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
                itemId: Number(itemToAdd),
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
            itemId: Number(itemToAdd),
          },
        });
      }
      return uCart as UserCart;
    },
  }),
  deleteFromCart: t.field({
    args: {
      cartId: t.arg({ required: true, type: 'String' }),
      itemId: t.arg({ required: true, type: 'String' }),
    },
    type: userCart,
    resolve: async (root, args) => {
      await prisma.cartItem.delete({
        where: {
          id: Number(args.itemId),
        },
      });
      const updatedCart = await prisma.userCart.findUnique({
        where: {
          id: Number(args.cartId),
        },
      });
      return updatedCart as UserCart;
    },
  }),
  incrementCartItem: t.field({
    args: {
      cartId: t.arg({ required: true, type: 'String' }),
    },
    type: cartItem,
    resolve: async (parent, args) => {
      const shopItemToIncrement = await prisma.cartItem.update({
        where: {
          id: Number(args.cartId),
        },
        data: {
          quantity: { increment: 1 },
        },
      });
      return shopItemToIncrement;
    },
  }),
}));
