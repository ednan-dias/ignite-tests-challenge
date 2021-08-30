import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a statement deposit", async () => {
    const userData: ICreateUserDTO = {
      email: "ednandias@gmail.com",
      name: "Ednan Dias",
      password: "eusouonan65",
    };

    const { id } = await createUserUseCase.execute(userData);

    const statement: ICreateStatementDTO = {
      description: "Description Test",
      amount: 250,
      user_id: id,
      type: "deposit" as OperationType,
    };

    const result = await createStatementUseCase.execute(statement);
    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("deposit");
  });

  it("should be able to create a statement withdraw", async () => {
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

    const withdraw: ICreateStatementDTO = {
      description: "Withdraw Test",
      amount: 250,
      user_id: id,
      type: "withdraw" as OperationType,
    };

    const result = await createStatementUseCase.execute(withdraw);
    expect(result).toHaveProperty("id");
    expect(result.type).toEqual("withdraw");
  });

  it("should not be able to create a statement if the user does not exist", async () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        description: "Description Test",
        amount: 250,
        user_id: "123456",
        type: "deposit" as OperationType,
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a statement if the withdraw is greater than available", async () => {
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

      const withdraw: ICreateStatementDTO = {
        description: "Withdraw Test",
        amount: 500,
        user_id: id,
        type: "withdraw" as OperationType,
      };

      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
