import { faker } from '@faker-js/faker';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function seed() {
  const users: { accessToken: string }[] = [];
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const password = 'password123';
    const username = faker.internet.username().slice(0, 20);

    await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password,
      username,
    });
    const { data } = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    users.push(data);
  }

  const gameIds = ['6998ac57cb71f9d240ee7dd9', '699ae53ce9141cef86b12808'];

  for (const user of users) {
    for (const gameId of gameIds) {
      await axios.post(
        `${BASE_URL}/scores`,
        {
          gameId,
          score: faker.number.int({ min: 1, max: 1000 }),
        },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        },
      );
    }
  }

  console.log('Seeding done');
}

seed().catch(console.error);
