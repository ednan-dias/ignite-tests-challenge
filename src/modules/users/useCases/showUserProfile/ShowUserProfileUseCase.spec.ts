import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able show user profile info", async () => {
    const userData: ICreateUserDTO = {
      email: "ednandias@gmail.com",
      name: "Ednan Dias",
      password: "eusouonan65",
    };

    const { id } = await createUserUseCase.execute(userData);

    const user = await showUserProfileUseCase.execute(id);

    const expectedReturn = {
      id,
      email: user.email,
      name: user.name,
      password: user.password,
    };

    expect(user).toMatchObject(expectedReturn);
  });

  it("should not be able show user profile info with user not exists", async () => {
    const userData: ICreateUserDTO = {
      email: "ednandias@gmail.com",
      name: "Ednan Dias",
      password: "eusouonan65",
    };

    await createUserUseCase.execute(userData);

    await expect(async () => {
      await showUserProfileUseCase.execute("1234");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
