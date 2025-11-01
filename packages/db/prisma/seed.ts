import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com' },
  });

  // Seed common assets
  const btc = await prisma.asset.upsert({
    where: { symbol: 'BTC' },
    update: {},
    create: { symbol: 'BTC', name: 'Bitcoin' },
  });
  const eth = await prisma.asset.upsert({
    where: { symbol: 'ETH' },
    update: {},
    create: { symbol: 'ETH', name: 'Ethereum' },
  });

  // Demo account for the user
  const account = await prisma.account.upsert({
    where: { externalId: 'demo-acc-1' },
    update: { name: 'Demo Account' },
    create: {
      userId: user.id,
      name: 'Demo Account',
      provider: 'demo',
      externalId: 'demo-acc-1',
    },
  });

  // Seed holdings
  await prisma.holding.createMany({
    data: [
      { accountId: account.id, assetId: btc.id, quantity: '0.25' },
      { accountId: account.id, assetId: eth.id, quantity: '1.5' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed complete:', { user: user.email, account: account.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

