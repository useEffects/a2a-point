import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateKeycloakToken } from '../utils';

export const POST = async (req: Request) => {
  const body = await req.json();
  const parsedBody = payloadSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error.errors, {
      status: 400,
    });
  }

  const { token } = parsedBody.data;

  try {
    const decodedToken = await validateKeycloakToken(token);
    return NextResponse.json(decodedToken);
  } catch (error) {
    return NextResponse.json(error, {
      status: 401,
    });
  }
};

const payloadSchema = z.object({
  token: z.string().min(0, 'token is required'),
});
