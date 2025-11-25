export async function setTokensServer
// @ts-ignore
({ accessToken, refreshToken, res }) {
  // Set access token as httpOnly cookie (15 minutes)
  res.setHeader('Set-Cookie', [
    `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/`,
    `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/api/auth/refresh`
  ])
}
