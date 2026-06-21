import { App } from "$fresh";
import { fsRoutes } from "$fresh/fs-routes";
import { define } from "$fresh/server";

const app = new App().use(fsRoutes());

export default define(app);
