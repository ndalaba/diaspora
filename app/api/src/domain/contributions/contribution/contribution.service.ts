import ContributionRepository from "./contribution.repository";
import AssociationRepository from "../../associations/association.repository";
import {
    CreateContributionDto,
    GetContributionDto,
    GetContributionsDto,
    UpdateContributionDto
} from "./contribution.schema";
import SessionRepository from "../session/session.repository";
import Response from "../../../utils/response.utils";
import {tryCatch} from "../../../utils/functions.utils";
import {NotAllowedError} from "../../../utils/errors.utils";
import Contribution from "./contribution.entity";
import Session from "../session/session.entity";
import Association from "../../associations/association.entity";

export default class ContributionService {
    constructor(private readonly contributionRepo: ContributionRepository = new ContributionRepository(),
                private readonly associationRepo: AssociationRepository = new AssociationRepository(),
                private readonly sessionRepo: SessionRepository = new SessionRepository()
    ) {
    }

    async updateContribution(dto: UpdateContributionDto): Promise<Response> {
        const isContributionValid = async (associationId: number, sessionId: number): Promise<boolean> => {
            const contribution = await this.contributionRepo.findByAssociationSessionName(associationId, sessionId, dto.name) as Contribution;
            return contribution === null || contribution.uid !== dto.uid;
        };

        return tryCatch(async () => {
            const association = await this.associationRepo.getOrFail(dto.association_uid) as Association;

            if (!association.canManage(dto.user)) throw new NotAllowedError("Not allowed");
            const session = await this.sessionRepo.getOrFail(dto.session_uid) as Session;
            let contribution = await this.contributionRepo.getOrFail(dto.uid) as Contribution;

            if (!await isContributionValid(contribution.association.id, session.id)) return new Response().addError("contributionExist", "Contribution already created");

            contribution.hydrate(dto);
            contribution.session = session;

            contribution = await this.contributionRepo.save(contribution) as Contribution;
            return new Response().addData("contribution", contribution);
        }, dto.name);

    }

    async getContribution(dto: GetContributionDto): Promise<Response> {
        return tryCatch(async () => {
            const contribution = await this.contributionRepo.getOrFail(dto.uid) as Contribution;

            if (!contribution.canManage(dto.user)) throw new NotAllowedError("Not allowed");

            return new Response().addData("contribution", contribution);
        }, dto.uid);
    }

    async getContributions(dto: GetContributionsDto): Promise<Response> {
        return tryCatch(async () => {
            const association = await this.associationRepo.getOrFail(dto.association_uid) as Association;
            if (!association.canManage(dto.user)) throw new NotAllowedError("Not allowed");

            let session = null;
            if (dto.session_uid !== undefined && dto.session_uid.trim() !== "")
                session = await this.sessionRepo.getOrFail(dto.session_uid) as Session;

            const contributions = await this.contributionRepo.filterContributions(association.id, session !== null ? session.id : 0);

            return new Response().addData("contributions", contributions);
        }, dto.association_uid);
    }

    async removeContribution(dto: GetContributionDto): Promise<Response> {

        const canBeDeleted = async (contributionId: number): Promise<boolean> => await this.contributionRepo.countAmounts(contributionId) == 0;

        return tryCatch(async () => {
            const contribution = await this.contributionRepo.getOrFail(dto.uid) as Contribution;

            const association = await this.associationRepo.getOrFail(contribution.association.uid) as Association;

            if (!association.canManage(dto.user)) throw new NotAllowedError("Not allowed");

            if (!await canBeDeleted(contribution.id)) return new Response().addError("denied", "Contribution can't be deleted.");

            await this.contributionRepo.remove(contribution);

            return new Response();

        }, dto.uid);
    }

    async createContribution(dto: CreateContributionDto): Promise<Response> {
        const isContributionValid = async (associationId: number, sessionId: number): Promise<boolean> => {
            const contribution = await this.contributionRepo.findByAssociationSessionName(associationId, sessionId, dto.name) as Contribution;
            return contribution == null;
        };

        return tryCatch(async () => {
            const association = await this.associationRepo.getOrFail(dto.association_uid) as Association;

            if (!association.canManage(dto.user)) throw new NotAllowedError("Not allowed");
            const session = await this.sessionRepo.getOrFail(dto.session_uid) as Session;

            if (!await isContributionValid(association.id, session.id)) return new Response().addError("contributionExist", "Contribution already created");

            let contribution = new Contribution(dto);
            contribution.association = association;
            contribution.session = session;
            contribution = await this.contributionRepo.save(contribution) as Contribution;
            return new Response().addData("contribution", contribution);
        }, dto.name);
    }
}