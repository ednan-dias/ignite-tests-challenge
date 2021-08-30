import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get balance", async () => {
    const userData: ICreateUserDTO = {
      email: "ednandias@gmail.com",
      name: "Ednan Dias",
      password: "eusouonan65",
    };

    const { id } = await createUserUseCase.execute(userData);

    const deposit: ICreateStatementDTO = {
      description: "Deposit Test",
      amount: 400,
      user_id: id,
      type: "deposit" as OperationType,
    };

    await createStatementUseCase.execute(deposit);

    const responseObject = await getBalanceUseCase.execute({ user_id: id });

    expect(responseObject.statement.length).toEqual(1);
    expect(responseObject).toHaveProperty("balance");
  });

  it("should not be able get balance if user not exists", async () => {
    expect(async () => {
      const userData: ICreateUserDTO = {
        email: "ednandias@gmail.com",
        name: "Ednan Dias",
        password: "eusouonan65",
      };

      const { id } = await createUserUseCase.execute(userData);

      const deposit: ICreateStatementDTO = {
        description: "Deposit Test",
        amount: 400,
        user_id: id,
        type: "deposit" as OperationType,
      };

      await createStatementUseCase.execute(deposit);

      await getBalanceUseCase.execute({
        user_id: "123456",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
