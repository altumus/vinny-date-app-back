
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedFunction() {
  const meetGoals = await prisma.meetGoal.createMany({
    data: [
      {title: "Свидания"},
      {title: "Общение без цели"},
      {title: "Отношения"},
      {title: "Дружба"}
    ]
  })

  console.log('goals is filled', meetGoals)
}

seedFunction().then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error('error occured while seeding', e)
  await prisma.$disconnect()
  process.exit(1)
})
