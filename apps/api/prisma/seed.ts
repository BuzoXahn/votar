import { PrismaClient, PollStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const professions = await Promise.all([
    prisma.profession.upsert({ where: { slug: 'medicina' },       update: {}, create: { slug: 'medicina',        nameEs: 'Medicina y Salud',          category: 'salud',      displayOrder: 1 } }),
    prisma.profession.upsert({ where: { slug: 'educacion' },      update: {}, create: { slug: 'educacion',       nameEs: 'Educación y Docencia',      category: 'educacion',  displayOrder: 2 } }),
    prisma.profession.upsert({ where: { slug: 'ingenieria' },     update: {}, create: { slug: 'ingenieria',      nameEs: 'Ingeniería y Tecnología',   category: 'tecnologia', displayOrder: 3 } }),
    prisma.profession.upsert({ where: { slug: 'derecho' },        update: {}, create: { slug: 'derecho',         nameEs: 'Derecho y Justicia',        category: 'legal',      displayOrder: 4 } }),
    prisma.profession.upsert({ where: { slug: 'economia' },       update: {}, create: { slug: 'economia',        nameEs: 'Economía y Finanzas',       category: 'economia',   displayOrder: 5 } }),
    prisma.profession.upsert({ where: { slug: 'arte-cultura' },   update: {}, create: { slug: 'arte-cultura',    nameEs: 'Arte y Cultura',            category: 'cultura',    displayOrder: 6 } }),
    prisma.profession.upsert({ where: { slug: 'ciencias' },       update: {}, create: { slug: 'ciencias',        nameEs: 'Ciencias e Investigación',  category: 'ciencia',    displayOrder: 7 } }),
    prisma.profession.upsert({ where: { slug: 'sector-publico' }, update: {}, create: { slug: 'sector-publico',  nameEs: 'Sector Público',            category: 'gobierno',   displayOrder: 8 } }),
    prisma.profession.upsert({ where: { slug: 'emprendimiento' }, update: {}, create: { slug: 'emprendimiento',  nameEs: 'Emprendimiento y Negocios', category: 'negocios',   displayOrder: 9 } }),
    prisma.profession.upsert({ where: { slug: 'otro' },           update: {}, create: { slug: 'otro',            nameEs: 'Otro / Prefiero no decir',  category: 'otro',       displayOrder: 10 } }),
  ]);
  console.log(`✅ ${professions.length} profesiones creadas`);

  const official1 = await prisma.official.upsert({
    where: { id: 'official-seed-001' },
    update: {},
    create: {
      id: 'official-seed-001',
      fullName: 'Claudia Sheinbaum Pardo',
      position: 'Presidenta de la República',
      institution: 'Poder Ejecutivo Federal',
      level: 'federal',
      bioSummary: 'Presidenta constitucional de México desde el 1 de octubre de 2024.',
    },
  });

  const official2 = await prisma.official.upsert({
    where: { id: 'official-seed-002' },
    update: {},
    create: {
      id: 'official-seed-002',
      fullName: 'Clara Brugada Molina',
      position: 'Jefa de Gobierno',
      institution: 'Gobierno de la Ciudad de México',
      level: 'estatal',
      state: 'CDMX',
      bioSummary: 'Jefa de Gobierno de la Ciudad de México desde 2024.',
    },
  });
  console.log(`✅ 2 funcionarios creados`);

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const inSevenDays  = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const inTwoDays    = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  const poll1 = await prisma.poll.upsert({
    where: { slug: 'reforma-agua-2025' },
    update: {},
    create: {
      slug: 'reforma-agua-2025',
      title: '¿Apoyas la Ley de Gestión del Agua 2025?',
      description: 'Iniciativa que propone la gestión pública y comunitaria del agua como derecho humano, limitando la participación privada en el suministro.',
      category: 'ley',
      status: PollStatus.ACTIVE,
      startsAt: threeDaysAgo,
      endsAt: inSevenDays,
      options: {
        create: [
          { text: 'Sí, apoyo la iniciativa', order: 1 },
          { text: 'No, me opongo', order: 2 },
          { text: 'Me abstengo / No tengo suficiente información', order: 3 },
        ],
      },
    },
  });

  const poll2 = await prisma.poll.upsert({
    where: { slug: 'calidad-transporte-publico' },
    update: {},
    create: {
      slug: 'calidad-transporte-publico',
      title: '¿Cómo calificarías el transporte público en tu ciudad?',
      description: 'Consulta ciudadana sobre la calidad percibida del transporte público.',
      category: 'consulta',
      status: PollStatus.ACTIVE,
      startsAt: threeDaysAgo,
      endsAt: inTwoDays,
      options: {
        create: [
          { text: 'Excelente', order: 1 },
          { text: 'Bueno', order: 2 },
          { text: 'Regular', order: 3 },
          { text: 'Malo', order: 4 },
          { text: 'Muy malo', order: 5 },
        ],
      },
    },
  });

  await prisma.officialPoll.upsert({
    where: { officialId_pollId: { officialId: official1.id, pollId: poll1.id } },
    update: {},
    create: { officialId: official1.id, pollId: poll1.id, relation: 'involucrada' },
  });

  console.log(`✅ Votaciones demo creadas: ${poll1.slug}, ${poll2.slug}`);
  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((e) => { console.error('❌ Seed falló:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
