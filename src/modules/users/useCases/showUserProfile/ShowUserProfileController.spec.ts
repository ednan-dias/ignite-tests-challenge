import { app } from "../../../../app";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";

let connection: Connection;
describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get profile of user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Ednan Dias",
      email: "ednan.741@gmail.com",
      password: "eusouonan65",
    });

    const {
      body: { token },
    } = await request(app).post("/api/v1/sessions").send({
      email: "ednan.741@gmail.com",
      password: "eusouonan65",
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("updated_at");
  });

  it("should not be able to get the user profile if the token is not entered", async () => {
    const response = await request(app).get("/api/v1/profile");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("JWT token is missing!");
  });
});
