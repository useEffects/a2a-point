import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getToken } from '../utils';

export const POST = async (req: Request) => {
  const body = await req.json();
  const parsedBody = payloadSchema.safeParse(body);

  if (!parsedBody.success) return NextResponse.json({ errors: parsedBody.error.errors }, { status: 401 });

  try {
    const tokens = await getToken(parsedBody.data);
    return NextResponse.json(tokens);
  } catch (error) {
    return NextResponse.json(error, { status: 401 });
  }
};

const payloadSchema = z.object({
  code: z.string().min(0, 'code is required'),
  codeVerifier: z.string().min(0, 'codeVerifier is required'),
  redirectUri: z.string().min(0, 'redirectUri is required'),
});
