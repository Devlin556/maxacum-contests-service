import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';

import { getAuthToken } from '../helpers/get-auth-token';
import { ERRORS } from '../helpers/errors';

export const joinHandler: APIGatewayProxyHandler = async (event) => {
  const parsedBody = JSON.parse(event.body);

  const { nickname } = parsedBody;

  if (!nickname) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'Invalid input: nickname is required',
        code: ERRORS.NICKNAME_REQUIRED,
      })
    }
  }

  let result;

  try {
    result = await axios.request({
      url: `${process.env.BASE_API_URL}/contestants`,
      data: {
        nickname,
      },
      headers: {
        Authorization: `Basic ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      method: 'POST'
    });
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Invalid input: you already registered',
        code: ERRORS.ALREADY_REGISTERED
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        contestant: result.data,
      }
    })
  }
}