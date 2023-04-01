import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import ErrorsPlugin from '@pothos/plugin-errors';
import prisma from './db';

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes,
  Scalars: {
    DateTime: {
      Input: Date,
      Output: Date
    }
  }
  Context: {},
}>({
  plugins: [PrismaPlugin, ErrorsPlugin],
  errorOptions: {
    defaultTypes: [],
  },
  prisma: {
    client: prisma,
  },

});

builder.queryType({});
builder.mutationType({});

builder.addScalarType('DateTime', DateTimeResolver, {});

export default builder;
