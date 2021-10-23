import { InMemoryUsersRepository } from "../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../useCases/createUser/CreateUserUseCase";

describe('CreateUserUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
  })

  it('Should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    expect(user).toHaveProperty('id')

  })

  it('Should not be able to create an user with existent e-mail', async () => {
    await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    await expect(createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })).rejects.toBeInstanceOf(CreateUserError)
  })
})