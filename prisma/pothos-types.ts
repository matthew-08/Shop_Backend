/* eslint-disable */
import type { Prisma, Category, ShopItem, User, UserCart, CartItem } from "@prisma/client";
export default interface PrismaTypes {
    Category: {
        Name: "Category";
        Shape: Category;
        Include: Prisma.CategoryInclude;
        Select: Prisma.CategorySelect;
        OrderBy: Prisma.CategoryOrderByWithRelationInput;
        WhereUnique: Prisma.CategoryWhereUniqueInput;
        Where: Prisma.CategoryWhereInput;
        Create: {};
        Update: {};
        RelationName: "ShopItem";
        ListRelations: "ShopItem";
        Relations: {
            ShopItem: {
                Shape: ShopItem[];
                Name: "ShopItem";
            };
        };
    };
    ShopItem: {
        Name: "ShopItem";
        Shape: ShopItem;
        Include: Prisma.ShopItemInclude;
        Select: Prisma.ShopItemSelect;
        OrderBy: Prisma.ShopItemOrderByWithRelationInput;
        WhereUnique: Prisma.ShopItemWhereUniqueInput;
        Where: Prisma.ShopItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "category";
        ListRelations: never;
        Relations: {
            category: {
                Shape: Category;
                Name: "Category";
            };
        };
    };
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "UserCart";
        ListRelations: "UserCart";
        Relations: {
            UserCart: {
                Shape: UserCart[];
                Name: "UserCart";
            };
        };
    };
    UserCart: {
        Name: "UserCart";
        Shape: UserCart;
        Include: Prisma.UserCartInclude;
        Select: Prisma.UserCartSelect;
        OrderBy: Prisma.UserCartOrderByWithRelationInput;
        WhereUnique: Prisma.UserCartWhereUniqueInput;
        Where: Prisma.UserCartWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "CartItem";
        ListRelations: "CartItem";
        Relations: {
            user: {
                Shape: User;
                Name: "User";
            };
            CartItem: {
                Shape: CartItem[];
                Name: "CartItem";
            };
        };
    };
    CartItem: {
        Name: "CartItem";
        Shape: CartItem;
        Include: Prisma.CartItemInclude;
        Select: Prisma.CartItemSelect;
        OrderBy: Prisma.CartItemOrderByWithRelationInput;
        WhereUnique: Prisma.CartItemWhereUniqueInput;
        Where: Prisma.CartItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "cart";
        ListRelations: never;
        Relations: {
            cart: {
                Shape: UserCart;
                Name: "UserCart";
            };
        };
    };
}