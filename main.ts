import { App } from "$fresh";
import { fsRoutes } from "$fresh/fs-routes";
import { define } from "$fresh/server";

const app = new App();
app.use(fsRoutes());

if (import.meta.main) {
  await define(app);
}
