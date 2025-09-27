import SessionRepository from "./session.repository";
import AssociationRepository from "../../associations/association.repository";
import { CreateSessionDto, GetSessionDto, GetSessionsDto, UpdateSessionDto } from "./session.schema";
import Response from "../../../utils/response.utils";
import { tryCatch } from "../../../utils/functions.utils";
import { NotAllowedError } from "../../../utils/errors.utils";
import Session from "./session.entity";
import Association from "../../associations/association.entity";

export default class SessionService {
  constructor(private readonly sessionRepo: SessionRepository = new SessionRepository(), private readonly associationRepo: AssociationRepository = new AssociationRepository()) {
  }

  async updateSession(dto: UpdateSessionDto): Promise<Response> {
    const isSessionValid = async (associationId: number) => {
      const session = await this.sessionRepo.findByName(dto.name, associationId);
      return session == null || session.uid === dto.uid;
    };

    return tryCatch(async () => {
      let session = await this.sessionRepo.getOrFail(dto.uid) as Session;

      if (!session.canManage(dto.user)) throw new NotAllowedError("Not allowed");

      if (!await isSessionValid(session.association.id))
        return new Response().addError("sessionExist", "Session name already created");

      session.hydrate(dto);

      session = await this.sessionRepo.save(session) as Session;
      return new Response().addData("session", session);

    }, dto.name);
  }

  async getSession(dto: GetSessionDto): Promise<Response> {
    return tryCatch(async () => {
      const session = await this.sessionRepo.getOrFail(dto.uid) as Session;

      if (!session.canManage(dto.user)) throw new NotAllowedError("Not Allowed");

      return new Response().addData("session", session);
    }, dto.uid);
  }

  async getSessions(dto: GetSessionsDto): Promise<Response> {
    return tryCatch(async () => {
      const association = await this.associationRepo.getOrFail(dto.association_uid) as Association;

      if (!association.canManage(dto.user)) throw new NotAllowedError("Not Allowed");

      const sessions = await this.sessionRepo.findByAssociation(association.id);

      return new Response().addData("sessions", sessions);

    }, dto.association_uid);
  }

  async removeSession(dto: GetSessionDto): Promise<Response> {
    return tryCatch(async () => {
      const contributionsCount = await this.sessionRepo.countContributions<string>(dto.uid);
      if (contributionsCount > 0)
        return new Response().addError("has_contributions", "This session has contribution");

      const session = await this.sessionRepo.getOrFail(dto.uid) as Session;
      if (!session.canManage(dto.user))
        throw new NotAllowedError("Not allowed");

      await this.sessionRepo.remove(session);
      return new Response();
    }, dto.uid);
  }

  async createSession(dto: CreateSessionDto): Promise<Response> {
    const isSessionValid = async (associationId: number) => {
      const session = await this.sessionRepo.findByName(dto.name, associationId);
      return session == null;
    };

    return tryCatch(async () => {
      const association = await this.associationRepo.getOrFail(dto.association_uid) as Association;

      if (!association.canManage(dto.user)) throw new NotAllowedError("Not allowed");

      if (!await isSessionValid(association.id)) return new Response().addError("sessionExist", "Session is already created.");

      let session = new Session(dto);
      session.association = association;
      session = await this.sessionRepo.save(session) as Session;
      return new Response().addData("session", session);

    }, "create session " + dto.name);
  }
}