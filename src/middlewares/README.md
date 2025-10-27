# Route-Level Middlewares
The directory of `src/middlewares/` serves a purpose of route-level middleware, and not global.

## Usage
Import and use the files from `src/app/api/**/route.ts` in combination with `compose` utility.
```typescript
import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/auth';
import { method } from '@/domains/**/controller';

export const POST = compose(
  accessToken,
  // other middlewares here...
)(method);
```
