import CredentialsProvider from 'next-auth/providers/credentials';
import { Session } from 'next-auth';
import directus from '@/lib/directus';
import { readMe, withToken } from '@directus/sdk';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.DIRECTUS_URL}/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { 'Content-Type': 'application/json' },
                });
                const user = await res.json();
                if (!res.ok && user) {
                    throw new Error('Email address or password is invalid');
                }
                if (res.ok && user) {
                    return user;
                }
                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async jwt({ token, user, account }: { token: JWT; user: any; account: any }) {
            if (account && user) {
                const userData = await directus.request(
                    withToken(
                        user.data.access_token as string,
                        readMe({
                            fields: ['id', 'first_name', 'last_name'],
                        })
                    )
                );
                return {
                    ...token,
                    accessToken: user.data.access_token,
                    refreshToken: user.data.refresh_token,
                    user: userData,
                };
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: any }) {
            if (session) {
                session = Object.assign({}, session, { access_token: token.access_token, id: token.id, user: token.user }) as Session & { access_token: string, id: number }
            }
            return session
        },
    },
});

export { handler as GET, handler as POST }