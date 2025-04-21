/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  PrismaClient,
  Role,
  OrderStatus,
  MethodPayment,
  StatusPayment,
  ReportType,
} from '@prisma/client';
import { fakerID_ID as faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean database
    await prisma.$transaction([
      prisma.orderItem.deleteMany(),
      prisma.payments.deleteMany(),
      prisma.likes.deleteMany(),
      prisma.reports.deleteMany(),
      prisma.orders.deleteMany(),
      prisma.products.deleteMany(),
      prisma.users.deleteMany(),
      prisma.tanks.deleteMany(),
    ]);

    // Create admin & users
    await prisma.users.create({
      data: {
        username: 'Super Admin',
        email: 'admin@admin.com',
        phone: '081234567890',
        addres: faker.location.streetAddress(),
        role: Role.superadmin,
        path_image: faker.image.avatar(),
        credential: {
          create: {
            password: bcrypt.hashSync('Password123', 10),
          },
        },
      },
    });

    await prisma.users.createMany({
      data: Array(5)
        .fill(null)
        .map(() => ({
          username: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          addres: faker.location.streetAddress(),
          role: Role.user,
          path_image: faker.image.avatar(),
          credential: {
            create: {
              password: bcrypt.hashSync('Password123', 10),
            },
          },
        })),
    });

    await prisma.products.createMany({
      data: Array(10)
        .fill(null)
        .map(() => ({
          name: faker.commerce.productName(),
          price: faker.number.float({ min: 10000, max: 1000000 }),
          description: faker.commerce.productDescription(),
          stock: faker.number.int({ min: 1, max: 100 }),
          path_image: faker.image.url(),
        })),
    });

    // Get all users and products for relations
    const allUsers = await prisma.users.findMany();
    const allProducts = await prisma.products.findMany();

    // Create orders and related data
    for (const user of allUsers) {
      // Create order
      const order = await prisma.orders.create({
        data: {
          user_id: user.id,
          status: OrderStatus.pending,
          quantity: faker.number.int({ min: 1, max: 5 }),
          total_price: faker.number.float({ min: 10000, max: 5000000 }),
        },
      });

      // Create order items
      await prisma.orderItem.create({
        data: {
          order_id: order.id,
          product_sku: allProducts[0].sku,
          quantity: faker.number.int({ min: 1, max: 3 }),
          price_at_purchase: allProducts[0].price,
        },
      });

      // Create payment
      await prisma.payments.create({
        data: {
          order_id: order.id,
          method: MethodPayment.manual_transfer,
          status: StatusPayment.pending,
          paid_at: new Date(),
        },
      });

      // Create like (50% chance)
      if (faker.datatype.boolean()) {
        await prisma.likes.create({
          data: {
            user_id: user.id,
            order_id: order.id,
            rating: faker.number.int({ min: 1, max: 5 }),
          },
        });
      }

      // Create report
      await prisma.reports.create({
        data: {
          user_id: user.id,
          type: faker.helpers.arrayElement([
            ReportType.income,
            ReportType.expense,
          ]),
          description: faker.lorem.sentence(),
          amount: faker.number.float({ min: 10000, max: 1000000 }),
        },
      });
    }

    // Create tank
    await prisma.tanks.create({
      data: {
        current_volume: 500,
        max_cappacity: 1000,
        is_warning: false,
      },
    });

    console.log('✅ Seed completed');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => {
    void prisma.$disconnect();
  });
