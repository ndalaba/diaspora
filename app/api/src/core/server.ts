import Fastify from "fastify";
import registerPlugins from "./plugins";
import authRoutes from "../domain/auths/auth.controller";

export async function buildServer() {
  const app = Fastify({ logger: true });

  await registerPlugins(app);

  app.register(authRoutes, { prefix: "/auth" });

  return app;
}