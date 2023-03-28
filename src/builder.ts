import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { DateTimeResolver } from 'graphql-scalars';

const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date,
      Output: Date
    }
  }
}>({
  plugins: [PrismaPlugin],

});

builder.addScalarType('DateTime', DateTimeResolver, {});