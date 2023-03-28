import { Prisma, PrismaClient } from '@prisma/client';
import { printSchema } from 'graphql';

const prisma = new PrismaClient();

export default prisma;
