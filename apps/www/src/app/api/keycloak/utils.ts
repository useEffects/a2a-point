import { KC_URL, KC_REALM, KC_CLIENT_ID, KC_CLIENT_SECRET } from '@/lib/constants';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { AuthTokens } from 'app/lib/types';

const keycloakIssuer = `${KC_URL}/realms/${KC_REALM}`;

// Create a JWKS client
const client = jwksClient({
  jwksUri: `${keycloakIssuer}/protocol/openid-connect/certs`,
});

// Get the signing key from JWKS
const getKey: jwt.GetPublicKeyOrSecret = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else if (!key) {
      callback(new Error('key undefined'));
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
};

// Validate the JWT token
export const validateKeycloakToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { audience: 'account', issuer: keycloakIssuer }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const refreshKeycloakTokens = async (refreshToken: string): Promise<AuthTokens> => {
  const tokenEndpoint = `${KC_URL}/realms/${KC_REALM}/protocol/openid-connect/token`;

  
  const body = new URLSearchParams();
  body.append('grant_type', 'refresh_token');
  body.append('refresh_token', refreshToken);
  body.append('client_id', KC_CLIENT_ID!);
  body.append('client_secret', KC_CLIENT_SECRET!);
  
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }
    
    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch (error) {
    throw error;
  }
};

export const getToken = async ({
  code,
  codeVerifier,
  redirectUri,
}: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}) => {
  try {
    const formData = {
      grant_type: 'authorization_code',
      client_id: KC_CLIENT_ID!,
      client_secret: KC_CLIENT_SECRET!,
      code: code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    };
    const formBody = [];
    for (const property in formData) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(formData[property as keyof typeof formData]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    const response = await fetch(`${KC_URL}/realms/${KC_REALM}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.join('&'),
    });
    if (response.ok) {
      return response.json();
    } else {
      const json = await response.json();
      console.error(json)
      throw new Error(json);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};
