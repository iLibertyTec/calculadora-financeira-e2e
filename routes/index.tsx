export default function Home(): Response {
  return new Response(
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>iFactory Product</title></head><body><main><h1>iFactory Product</h1><p>Server is running.</p></main></body></html>",
    {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}
