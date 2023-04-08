/* eslint-disable import/prefer-default-export */
import builder from '../builder';
import prisma from '../db';

export const shopItem = builder.prismaObject('ShopItem', {
  description: 'An object representing an individual shop item.',
  fields: (t) => ({
    itemName: t.exposeString('name'),
    itemDescription: t.exposeString('description'),
    itemImage: t.exposeString('img'),
    itemId: t.exposeID('id'),
    itemQuantity: t.exposeInt('quantity'),
    itemPrice: t.exposeFloat('price'),
  }),
});

builder.queryFields((t) => ({
  itemById: t.prismaField({
    type: 'ShopItem',
    nullable: true,
    description: 'An individual shop item obtained through ID',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, parent, args) => prisma.shopItem.findUnique({
      ...query,
      where: {
        id: args.id,
      },
    }),
  }),
  allItems: t.prismaField({
    type: ['ShopItem'],
    description: 'All shop items.',
    resolve: (query, parent, args) => prisma.shopItem.findMany(),
  }),
  itemByCategory: t.prismaField({
    type: ['ShopItem'],
    description: 'Shop items filtered by category',
    args: {
      categoryId: t.arg.int({ required: true }),
    },
    resolve: (query, parent, args) => prisma.shopItem.findMany({
      where: {
        category: {
          id: args.categoryId,
        },
      },
    }),
  }),
}));
