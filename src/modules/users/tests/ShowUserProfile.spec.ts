import { InMemoryUsersRepository } from "../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../useCases/createUser/CreateUserUseCase";
import { ShowUserProfileError } from "../useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../useCases/showUserProfile/ShowUserProfileUseCase";

describe('ShowUserProfileUseCase', () => {
  let fakeUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeEach(() => {
    fakeUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(fakeUsersRepository)
  })

  it('Should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Arthur',
      password: '4321'
    })

    const userId = user.id as string;

    const profile = await showUserProfileUseCase.execute(userId);

    expect(profile).toHaveProperty('id')
    expect(profile).toHaveProperty('email')
    expect(profile).toHaveProperty('name')
    expect(profile).toHaveProperty('password')
    expect(profile.email).toBe('teste@teste.com')
    expect(profile.name).toBe('Arthur')
  })

  it('Should be able to show user profile', async () => {
    await expect(showUserProfileUseCase.execute('someId')).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})