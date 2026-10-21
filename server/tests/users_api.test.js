const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

describe("When there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("Sekret", 10);
    const user = new User({
      username: "root",
      name: "Superuser",
      passwordHash,
    });

    await user.save();
  });

  test("users are returned as json with correct length", async () => {
    const result = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.length, 1);
  });

  describe("addition of a new user", () => {
    test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "test",
        name: "test create user",
        password: "password",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((user) => user.username);
      assert(usernames.includes(newUser.username));
    });

    test("creation fails with proper statuscode and message if username already taken", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "superuser",
        password: "password",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("expected `username` to be unique"));

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if password is invalid", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "invalidpassword",
        name: "Invalid Password",
        password: "ip",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes("Password must be at least 3 characters"),
      );

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
