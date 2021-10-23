import { InMemoryUsersRepository } from "../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../entities/Statement";
import { InMemoryStatementsRepository } from "../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../useCases/createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../useCases/getBalance/GetBalanceUseCase";

describe('GetBalanceUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let fakeStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    fakeStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(fakeUsersRepository,fakeStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(fakeStatementsRepository, fakeUsersRepository)
  })

  it('Should be able to get balance', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    const userId = user.id as string;

    await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming value', type: OperationType.DEPOSIT})
    await createStatementUseCase.execute({user_id: userId, amount: 200, description: 'Bill', type: OperationType.WITHDRAW})

    const balance = await getBalanceUseCase.execute({user_id: userId})

    expect(balance).toHaveProperty('statement')
    expect(balance).toHaveProperty('balance')

  })

  it('Should not be able to get balance from an unexistent user', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    const userId = user.id as string;

    await createStatementUseCase.execute({user_id: userId, amount: 1500, description: 'Incoming value', type: OperationType.DEPOSIT})
    await createStatementUseCase.execute({user_id: userId, amount: 200, description: 'Bill', type: OperationType.WITHDRAW})

    await expect(getBalanceUseCase.execute({user_id: 'user-invalid'})).rejects.toBeInstanceOf(GetBalanceError)
  })
})