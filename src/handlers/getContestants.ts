import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';

import { getAuthToken } from '../helpers/get-auth-token';
import { ERRORS } from '../helpers/errors';

export const getContestantsHandler: APIGatewayProxyHandler = async (event) => {
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

  try {
    const result = await axios.request({
      url: `${process.env.BASE_API_URL}/contestants`,
      headers: {
        Authorization: `Basic ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result.data
      })
    }
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Invalid request: cannot get contestants',
        code: ERRORS.CANNOT_GET_CONTESTANTS
      })
    }
  }
}