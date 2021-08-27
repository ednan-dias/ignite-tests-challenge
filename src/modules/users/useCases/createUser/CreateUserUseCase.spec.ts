import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { hash } from "bcryptjs";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const passwordHash = await hash("usertestpassword", 8);

    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "usertest@gmail.com",
      password: passwordHash,
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with email exists", () => {
    expect(async () => {
      const passwordHash = await hash("usertestpassword", 8);

      const user = {
        name: "User Test",
        email: "usertest@gmail.com",
        password: passwordHash,
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
