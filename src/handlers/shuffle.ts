import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';

import { getAuthToken } from '../helpers/get-auth-token';
import { ERRORS } from '../helpers/errors';
import { getRandomInRange } from '../helpers/get-random-in-range';

export const shuffleHandler: APIGatewayProxyHandler = async (event) => {
  const token = event.headers.token;

  if (token !== process.env.ADMIN_TOKEN) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'Forbidden',
        code: ERRORS.FORBIDDEN
      })
    }
  }

  let result;

  try {
    result = await axios.request({
      url: `${process.env.BASE_API_URL}/contestants`,
      headers: {
        Authorization: `Basic ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    });
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Invalid request: cannot get contestants',
        code: ERRORS.CANNOT_GET_CONTESTANTS
      })
    }
  }

  const { data } = result;

  const contestantsCount = data.length;

  const winnerIndex = getRandomInRange(0, contestantsCount - 1);

  const winner = data[winnerIndex];

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        winner
      }
    })
  }
}