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
      prisma.payment.deleteMany(),
      prisma.like.deleteMany(),
      prisma.reports.deleteMany(),
      prisma.order.deleteMany(),
      prisma.product.deleteMany(),
      prisma.user.deleteMany(),
      prisma.tank.deleteMany(),
    ]);

    // Create admin & users
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@admin.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '081234567890',
        role: Role.superadmin,
        path_image: faker.image.avatar(),
      },
    });

    await prisma.user.createMany({
      data: Array(5)
        .fill(null)
        .map(() => ({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync('password123', 10),
          phone: faker.phone.number(),
          role: Role.user,
          path_image: faker.image.avatar(),
        })),
    });

    await prisma.product.createMany({
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
    const allUsers = await prisma.user.findMany();
    const allProducts = await prisma.product.findMany();

    // Create orders and related data
    for (const user of allUsers) {
      // Create order
      const order = await prisma.order.create({
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
      await prisma.payment.create({
        data: {
          order_id: order.id,
          method: MethodPayment.manual_transfer,
          status: StatusPayment.pending,
          paid_at: new Date(),
        },
      });

      // Create like (50% chance)
      if (faker.datatype.boolean()) {
        await prisma.like.create({
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
    await prisma.tank.create({
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
