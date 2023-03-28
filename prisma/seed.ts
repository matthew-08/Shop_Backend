import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
];

async function main() {
  console.log('Start seeding ...');
  categories.forEach(async (cat) => {
    await prisma.category.create({
      data: {
        name: cat,
      },

    });
    console.log(`Added category ${cat}`);
  });

  console.log('Seeding finished.');
}
