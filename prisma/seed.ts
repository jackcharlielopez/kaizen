const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const parent = await prisma.parent.create({
    data: {
      id: "7fcf4c2d-7bb5-44f7-9ac5-5e570fa9d027",
      firstName: "Jack",
      lastName: "Lopez",
      email: "jack.charlie.lopez@gmail.com",
      membershipId: undefined,
    },
  });

  const child = await prisma.student.create({
    data: {
      id: "e035f2e3-ead8-4c6c-8f9d-aa47b82e9d77",
      firstName: "Catalena",
      lastName: "Lopez",
      birthDate: new Date("2020-05-31"),
      parentId: "7fcf4c2d-7bb5-44f7-9ac5-5e570fa9d027",
    },
  });

  console.log({ parent, child });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
