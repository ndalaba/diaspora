import { FastifyInstance } from "fastify";
import fastifyJwt from "fastify-jwt";
import fastifyCors from "fastify-cors";
import fastifyHelmet from "fastify-helmet";

export default async function registerPlugins(app: FastifyInstance) {
  app.register(fastifyCors, { origin: "*" });
  app.register(fastifyHelmet);
  app.register(fastifyJwt, { secret: "super-secret-key" }); // ⚠️ mettre dans process.env
}