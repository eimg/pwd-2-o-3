import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const name = faker.person.fullName();
const email = faker.internet.email();

const password = "apple";
const hash = bcrypt.hashSync(password, 10);

const user = { id: 1, name: "Alice" };
const token = jwt.sign(user, "xyz123");

console.log(token);
console.log("");
console.log(hash);
console.log("");
console.log(name);
console.log(email);
