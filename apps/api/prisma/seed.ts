import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const teacherPassword = await bcrypt.hash("teacher123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);
  const studentTwoPassword = await bcrypt.hash("student234", 10);

  const teacher = await prisma.user.upsert({
    where: { username: "teacher" },
    update: {},
    create: {
      username: "teacher",
      password: teacherPassword,
      role: Role.TEACHER,
    },
  });

  const student = await prisma.user.upsert({
    where: { username: "student" },
    update: {},
    create: {
      username: "student",
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  const studentTwo = await prisma.user.upsert({
    where: { username: "student2" },
    update: {},
    create: {
      username: "student2",
      password: studentTwoPassword,
      role: Role.STUDENT,
    },
  });

  console.log("Seeded users:", {
    teacher: teacher.username,
    student: student.username,
    student2: studentTwo.username,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
