import { CreateTripDto, EditTripDto } from './../src/trip/dto/trip.dto';
import { EditUserDto } from './../src/user/dto/user.dto';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { PrismaService } from './../src/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'demo_1@gmail.com',
      password: '123456',
    };
    describe('Signup', () => {
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: '123' })
          .expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should throw error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it("Should throw error if email is'nt unique", () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Signin', () => {
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: '123' })
          .expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should throw error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });

      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('Should edit user', () => {
        const dto: EditUserDto = {
          name: 'Majid',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name);
      });
    });
  });

  describe('Trip', () => {
    describe('Get empty Trips', () => {
      it('Should get empty trip', () => {
        return pactum
          .spec()
          .get('/trips')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Trip', () => {
      const trip1: CreateTripDto = {
        title: 'USA',
        description: 'summer trip to USA',
      };

      it('Should create trip', () => {
        return pactum
          .spec()
          .post('/trips')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(trip1)
          .expectStatus(201)
          .stores('tripId', 'id');
      });
    });

    describe('Get Trips', () => {
      it('Should get one trip', () => {
        return pactum
          .spec()
          .get('/trips')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get One Trips', () => {
      it('Should get created trip id', () => {
        return pactum
          .spec()
          .get('/trips/{id}')
          .withPathParams('id', '$S{tripId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Update Trip', () => {
      const editedDto: EditTripDto = {
        description: 'second summer trip to USA',
      };
      it('Should edit trip', () => {
        return pactum
          .spec()
          .patch('/trips/{id}')
          .withPathParams('id', '$S{tripId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(editedDto)
          .expectStatus(200)
          .expectBodyContains(editedDto.description);
      });
    });

    describe('Delete Trip', () => {
      it('Should delete trip', () => {
        return pactum
          .spec()
          .delete('/trips/{id}')
          .withPathParams('id', '$S{tripId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
    });
  });
});
