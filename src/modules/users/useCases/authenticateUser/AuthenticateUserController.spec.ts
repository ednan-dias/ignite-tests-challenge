import { app } from "../../../../app";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Ednan Dias",
      email: "ednan.741@gmail.com",
      password: "eusouonan65",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "ednan.741@gmail.com",
      password: "eusouonan65",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user.id");
    expect(response.body).toHaveProperty("user.name");
    expect(response.body).toHaveProperty("user.email");
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate a user if credentials are wrong", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Ednan Dias",
      email: "ednan.741@gmail.com",
      password: "eusouonan65",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "ednan.741@gmail.com",
      password: "incorrectpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Incorrect email or password");
  });
});
