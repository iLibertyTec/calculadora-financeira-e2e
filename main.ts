import { App, staticFiles } from "$fresh";
import { fsRoutes } from "$fresh/fs-routes";

const app: App = new App().use(staticFiles()).use(fsRoutes());

if (import.meta.main) {
  await app.listen();
}

export default app;
