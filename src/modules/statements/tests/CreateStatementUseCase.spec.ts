import { InMemoryUsersRepository } from "../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../entities/Statement";
import { InMemoryStatementsRepository } from "../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../useCases/createStatement/CreateStatementUseCase";

describe('CreateStatementUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let fakeStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    fakeStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(fakeUsersRepository,fakeStatementsRepository)
  })

  it('Should be able to create an incoming statement', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    const userId = user.id as string;

    const statement = await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming value', type: OperationType.DEPOSIT})

    expect(statement).toHaveProperty('id')
  })

  it('Should be able to create an outcoming statement', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    const userId = user.id as string;

    await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming value', type: OperationType.DEPOSIT})

    const statement = await createStatementUseCase.execute({user_id: userId, amount: 500, description: 'Bill', type: OperationType.WITHDRAW})

    expect(statement).toHaveProperty('id')
  })

  it('Should not be able to create an outcoming statement with insuficient funds', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    const userId = user.id as string;

    await expect(createStatementUseCase.execute({user_id: userId, amount: 500, description: 'Bill', type: OperationType.WITHDRAW})).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it('Should not be able to create a statement with unexistent user', async () => {
    await expect(createStatementUseCase.execute({user_id: 'unexistentUserId', amount: 500, description: 'Bill', type: OperationType.WITHDRAW})).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })
})