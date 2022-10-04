# shadowban-backend-deno
Deno backend server for a site that checks for Twitter shadowban.


# How to use

You need

- Deno


Run

```bash
$ deno task start
Listening on http://localhost:8000/
```

Quick note: You will find folders such as v1 in your project, but v1 and v2 are deprecated, so use v3 instead. However, for front-end reasons, even v3 uses the `/v2` endpoint. See `/src/server/v3.ts` for detailed endpoint information.