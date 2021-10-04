import { app } from "../../../../app";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";

let connection: Connection;
describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to deposit", async () => {
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
      .post("/api/v1/statements/deposit")
      .send({
        description: "Depósito do Mês",
        amount: 2000,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("type");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("updated_at");
  });

  it("should be able to withdraw", async () => {
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
      .post("/api/v1/statements/withdraw")
      .send({
        description: "Saque do Mês",
        amount: 2000,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("type");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("updated_at");
  });

  it("should not be able to withdraw if balance is insufficient", async () => {
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

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        description: "Depósito do Mês",
        amount: 4000,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        description: "Saque do Mês",
        amount: 4500,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Insufficient funds");
  });
});
