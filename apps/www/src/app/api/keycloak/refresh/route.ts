import { NextResponse } from 'next/server';
import { z } from 'zod';
import { refreshKeycloakTokens } from '../utils';

export const POST = async (req: Request) => {
  const body = await req.json();
  const parsedBody = payloadSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(parsedBody.error.errors, {
      status: 400,
    });
  }

  const { refreshToken } = parsedBody.data;

  try {
    const tokens = await refreshKeycloakTokens(refreshToken);
    return NextResponse.json(tokens);
  } catch (error) {
    return NextResponse.json(error, { status: 401 });
  }
};

const payloadSchema = z.object({
  refreshToken: z.string().min(0, 'refreshToken is required'),
});
