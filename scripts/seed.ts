import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default user
  const hashedPin = await bcrypt.hash('1234', 10)
  const user = await prisma.user.create({
    data: {
      pin: hashedPin
    }
  })
  console.log('✅ Created default user')

  // Create trainers
  const trainer1 = await prisma.trainer.create({
    data: {
      name: 'Juan Carlos',
      hourlyRate: 25.00,
      active: true
    }
  })

  const trainer2 = await prisma.trainer.create({
    data: {
      name: 'María González',
      hourlyRate: 30.00,
      active: true
    }
  })
  console.log('✅ Created trainers')

  // Create cleaning staff
  const cleaningStaff1 = await prisma.cleaningStaff.create({
    data: {
      name: 'Ana Martínez',
      hourlyRate: 15.00,
      active: true
    }
  })

  const cleaningStaff2 = await prisma.cleaningStaff.create({
    data: {
      name: 'Carlos López',
      hourlyRate: 18.00,
      active: true
    }
  })
  console.log('✅ Created cleaning staff')

  // Create plans
  const plan1 = await prisma.plan.create({
    data: {
      name: 'Plan Básico',
      durationInDays: 30,
      classesPerWeek: 2,
      totalClasses: 8,
      price: 50.00,
      active: true
    }
  })

  const plan2 = await prisma.plan.create({
    data: {
      name: 'Plan Premium',
      durationInDays: 30,
      classesPerWeek: 3,
      totalClasses: 12,
      price: 80.00,
      active: true
    }
  })

  const plan3 = await prisma.plan.create({
    data: {
      name: 'Plan VIP',
      durationInDays: 30,
      classesPerWeek: 5,
      totalClasses: 20,
      price: 120.00,
      active: true
    }
  })
  console.log('✅ Created plans')

  // Create members
  const member1 = await prisma.member.create({
    data: {
      firstName: 'Pedro',
      lastName: 'Ramírez',
      gender: 'M',
      email: 'pedro@example.com',
      phone: '555-7890',
      membershipNumber: 'GM001',
      active: true
    }
  })

  const member2 = await prisma.member.create({
    data: {
      firstName: 'Laura',
      lastName: 'Silva',
      gender: 'F',
      email: 'laura@example.com',
      phone: '555-4567',
      membershipNumber: 'GM002',
      active: true
    }
  })

  const member3 = await prisma.member.create({
    data: {
      firstName: 'Roberto',
      lastName: 'Torres',
      gender: 'M',
      email: 'roberto@example.com',
      phone: '555-1357',
      membershipNumber: 'GM003',
      active: true
    }
  })
  console.log('✅ Created members')

  // Create memberships
  const startDate1 = new Date()
  const endDate1 = new Date(startDate1.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const membership1 = await prisma.membership.create({
    data: {
      memberId: member1.id,
      planId: plan1.id,
      startDate: startDate1,
      endDate: endDate1,
      classesUsed: 2,
      paymentMethod: 'Efectivo',
      totalPaid: 50.00,
      active: true
    }
  })

  const startDate2 = new Date()
  const endDate2 = new Date(startDate2.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const membership2 = await prisma.membership.create({
    data: {
      memberId: member2.id,
      planId: plan2.id,
      startDate: startDate2,
      endDate: endDate2,
      classesUsed: 4,
      paymentMethod: 'Tarjeta',
      totalPaid: 80.00,
      active: true
    }
  })

  const startDate3 = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  const endDate3 = new Date(startDate3.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  const membership3 = await prisma.membership.create({
    data: {
      memberId: member3.id,
      planId: plan3.id,
      startDate: startDate3,
      endDate: endDate3,
      classesUsed: 15,
      paymentMethod: 'Transferencia',
      totalPaid: 120.00,
      active: true
    }
  })
  console.log('✅ Created memberships')

  // Create some visits
  const today = new Date()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

  await prisma.memberVisit.create({
    data: {
      memberId: member1.id,
      visitDate: today,
      notes: 'Primera visita del mes'
    }
  })

  await prisma.memberVisit.create({
    data: {
      memberId: member2.id,
      visitDate: yesterday,
      notes: 'Entrenamiento de fuerza'
    }
  })

  await prisma.memberVisit.create({
    data: {
      memberId: member3.id,
      visitDate: today,
      notes: 'Cardio y peso libre'
    }
  })
  console.log('✅ Created member visits')

  // Create trainer sessions
  await prisma.trainerSession.create({
    data: {
      trainerId: trainer1.id,
      date: today,
      startTime: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8 AM
      endTime: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM
      notes: 'Entrenamiento funcional grupal'
    }
  })

  await prisma.trainerSession.create({
    data: {
      trainerId: trainer2.id,
      date: today,
      startTime: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM
      endTime: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4 PM
      notes: 'Sesión personalizada'
    }
  })
  console.log('✅ Created trainer sessions')

  // Create cleaning sessions
  await prisma.cleaningSession.create({
    data: {
      staffId: cleaningStaff1.id,
      date: today,
      startTime: new Date(today.getTime() + 6 * 60 * 60 * 1000), // 6 AM
      endTime: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8 AM
      notes: 'Limpieza matutina completa'
    }
  })

  await prisma.cleaningSession.create({
    data: {
      staffId: cleaningStaff2.id,
      date: today,
      startTime: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6 PM
      endTime: new Date(today.getTime() + 20 * 60 * 60 * 1000), // 8 PM
      notes: 'Limpieza vespertina'
    }
  })
  console.log('✅ Created cleaning sessions')

  // Create cash transactions
  await prisma.cashTransaction.create({
    data: {
      type: 'INCOME',
      amount: 50.00,
      description: 'Pago membresía - Pedro Ramírez',
      responsible: 'Admin',
      date: today
    }
  })

  await prisma.cashTransaction.create({
    data: {
      type: 'INCOME',
      amount: 80.00,
      description: 'Pago membresía - Laura Silva',
      responsible: 'Admin',
      date: yesterday
    }
  })

  await prisma.cashTransaction.create({
    data: {
      type: 'EXPENSE',
      amount: 25.00,
      description: 'Productos de limpieza',
      responsible: 'Admin',
      date: today
    }
  })

  await prisma.cashTransaction.create({
    data: {
      type: 'EXPENSE',
      amount: 15.50,
      description: 'Mantenimiento equipos',
      responsible: 'Admin',
      date: yesterday
    }
  })
  console.log('✅ Created cash transactions')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📝 Default login credentials:')
  console.log('PIN: 1234')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })