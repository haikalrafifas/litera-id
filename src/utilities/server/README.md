Multipart middleware
====================

This folder provides a lightweight multipart/form-data middleware suitable for
Next.js App Router Route Handlers (server-side `Request`) and the project's
`compose(...middlewares)` helper.

Usage
-----

- Use the factory or helper exported from `multipart.ts`:

- `createMultipart(opts?)` returns a middleware compatible with `compose`.
- `withMultipart(opts?)` is a small helper that composes the middleware and
  returns a wrapped handler (nice for concise route files).
- `getMultipart(req)` returns `{ fields, files }` where `files` contains web
  `File` objects.

Example
-------

export const POST = withMultipart()(async (req) => {
  const { fields, files } = getMultipart(req);
  // process fields/files
});

Notes and tradeoffs
-------------------

- This implementation uses `Request.formData()` (WHATWG API) and therefore
  avoids adding heavy dependencies like `multer` or `busboy`.
- If you need streaming uploads or Express-style middleware (e.g. `multer`),
  consider creating a separate upload endpoint (pages/api or a small express
  service) or implement an adapter — those approaches may require buffering
  or OS-level temp files and will be more complex.
- `multipart` stores parsed data in a `WeakMap<Request, ...>` so it is
  request-scoped and will be garbage-collected after the request lifecycle.
