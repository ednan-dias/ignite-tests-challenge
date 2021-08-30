import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Get Statement Use Case", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able get statement operation", async () => {
    const userData: ICreateUserDTO = {
      email: "ednandias@gmail.com",
      name: "Ednan Dias",
      password: "eusouonan65",
    };

    const { id: user_id } = await createUserUseCase.execute(userData);

    const deposit: ICreateStatementDTO = {
      description: "Deposit Test",
      amount: 400,
      user_id: user_id,
      type: "deposit" as OperationType,
    };

    const { id: statement_id } = await createStatementUseCase.execute(deposit);

    await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });
  });

  it("should not be able get statement operation if user not exists", async () => {
    expect(async () => {
      const userData: ICreateUserDTO = {
        email: "ednandias@gmail.com",
        name: "Ednan Dias",
        password: "eusouonan65",
      };

      const { id: user_id } = await createUserUseCase.execute(userData);

      const deposit: ICreateStatementDTO = {
        description: "Deposit Test",
        amount: 400,
        user_id: user_id,
        type: "deposit" as OperationType,
      };

      const { id: statement_id } = await createStatementUseCase.execute(
        deposit
      );

      await getStatementOperationUseCase.execute({
        user_id: "12345",
        statement_id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able get statement operation if statement not exists", async () => {
    const userData: ICreateUserDTO = {
      email: "ednandias@gmail.com",
      name: "Ednan Dias",
      password: "eusouonan65",
    };

    const { id: user_id } = await createUserUseCase.execute(userData);

    const deposit: ICreateStatementDTO = {
      description: "Deposit Test",
      amount: 400,
      user_id,
      type: "deposit" as OperationType,
    };

    await createStatementUseCase.execute(deposit);

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user_id as string,
        statement_id: "123456",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
