import { App, staticFiles } from "$fresh";
import { fsRoutes } from "$fresh/fs-routes";

const app: App = new App().use(staticFiles()).use(fsRoutes());

if (import.meta.main) {
  const port: number = Number(Deno.env.get("PORT") ?? "8000");
  await app.listen({ port });
}

export default app;
