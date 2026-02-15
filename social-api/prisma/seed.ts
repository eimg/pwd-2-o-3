import { prisma } from "../libs/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

async function seed() {
	console.log("Seeding first user...");
	const alice = await prisma.user.create({
		data: {
			name: "Alice",
			username: "alice",
			bio: "First user",
			password: await bcrypt.hash("password", 10),
		},
	});

	console.log(alice);

	console.log("Seeding second user...");
	const bob = await prisma.user.create({
		data: {
			name: "Bob",
			username: "bob",
			bio: "Second user",
			password: await bcrypt.hash("password", 10),
		},
	});

	console.log(bob);

	console.log("Seeding posts...");
	for (let i = 0; i < 20; i++) {
		await prisma.post.create({
			data: {
				content: faker.lorem.paragraph(),
				userId: faker.number.int({ min: 1, max: 2 }),
			},
		});
	}
	console.log("posts seeding done.");

	console.log("Seeding comments...");
	for (let i = 0; i < 40; i++) {
		await prisma.comment.create({
			data: {
				content: faker.lorem.paragraph(),
				userId: faker.number.int({ min: 1, max: 2 }),
				postId: faker.number.int({ min: 1, max: 20 }),
			},
		});
	}
	console.log("comments seeding done.");
}

seed();
