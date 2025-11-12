// Minimal, synchronous-friendly mock of the jose API your code uses.
// Adjust return shapes if your jwt util depends on other props.

exports.SignJWT = function (payload) {
  this.payload = payload;
  this.setProtectedHeader = () => this;
  this.setExpirationTime = () => this;
  this.setIssuedAt = () => this;
  this.sign = async () => 'mocked-signed-token';
};

exports.jwtVerify = async (token, key, options) => {
  return { payload: { sub: 'mock-user-id', iat: Date.now() / 1000 } };
};

// Provide compactDecrypt if used by code
exports.compactDecrypt = async () => ({ plaintext: Buffer.from('{}') });

// named export placeholder
exports.JWTPayload = {};