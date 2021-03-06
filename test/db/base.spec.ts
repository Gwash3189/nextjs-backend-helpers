import { Prisma, PrismaClient, User } from '@prisma/client'
import { BaseRepository } from '../../src/db'
import { repository } from '../../src/db'
import { Repositorys } from '../../src/db/repository/base'

const describeif = (condition: boolean) => (condition ? describe : describe.skip)

describeif((process.env.INTEGRATION as any) === 'true')('BaseRepository', () => {
  class UserRepository extends BaseRepository<Prisma.UserDelegate<any>, User> {
    createClient(): PrismaClient {
      return new PrismaClient()
    }

    getDataType(client: PrismaClient): Prisma.UserDelegate<any> {
      return client.user
    }
  }

  beforeEach(() => {
    repository()(UserRepository)
  })

  it('is registered in the container', () => {
    expect(Repositorys.find(UserRepository)).toBeInstanceOf(UserRepository)
  })

  it('returns a mockable instance of a repository', async () => {
    const repo = Repositorys.find(UserRepository)

    expect(await repo.all()).toEqual(expect.any(Array))

    repo.mock(
      'all',
      jest.fn(() => Promise.resolve([{ name: 'Adam' }]))
    )

    expect(await repo.all()).toEqual([{ name: 'Adam' }])

    repo.reset('all')

    expect(await repo.all()).toEqual(expect.any(Array))
  })
})
