let n: number;
n = 123;

function add(a: number, b: number) {
    return a + b;
}

interface User {
    name: string;
    age: number;
}

let alice: User;
alice = { name: "Alice", age: 22 };

type Student = {
    name: string;
    age: number;
    gender?: "male" | "female";
}

let bob: Student;
bob = {
    name: "Bob",
    age: 23,
    gender: "male"
}

let eve: Student & { grade: "A" | "B" } = {
    name: "Eve",
    age: 24,
    grade: "A",
}

function wrap<T>(x: T) {
    return [x];
}

wrap<string>("abc");    // wrap("abc")
wrap<number>(123);      // wrap(123)
