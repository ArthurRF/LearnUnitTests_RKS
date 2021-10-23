import { InMemoryUsersRepository } from "../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../useCases/createUser/CreateUserUseCase";

describe('AuthenticateUserUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(fakeUsersRepository)
  })

  it('Should be able to authenticate an user', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: '4321'
    })

    expect(userAuthenticated).toHaveProperty('user')
    expect(userAuthenticated).toHaveProperty('token')
  })

  it('Should not be able to authenticate with wrong e-mail', async () => {
    await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    await expect(authenticateUserUseCase.execute({
      email: 'email@incorreto.com',
      password: '4321'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    await expect(authenticateUserUseCase.execute({
      email: user.email,
      password: 'senhaerrada'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})