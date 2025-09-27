import OfficeRepository from "./office.repository";
import AssociationRepository from "../associations/association.repository";
import {
    CreateOfficeDto,
    GetOfficeDto,
    GetOfficesDto,
    MemberToOfficeDto,
    UpdateOfficeDto
} from "./office.schema";
import {UserRepository} from "../users/user.repository";
import Response from "../../utils/response.utils";
import {tryCatch} from "../../utils/functions.utils";
import {NotAllowedError} from "../../utils/errors.utils";
import Office from "./office.entity";
import Association from "../associations/association.entity";
import User from "../users/user.entity";

export default class OfficeService {
    constructor(private readonly officeRepo: OfficeRepository = new OfficeRepository(), private readonly userRepo = new UserRepository(), private readonly associationRepo: AssociationRepository = new AssociationRepository()) {
    }

    async updateOffice(dto: UpdateOfficeDto): Promise<Response> {
        return tryCatch(async () => {
            const office = await this.officeRepo.getOrFail(dto.uid) as Office
            if (!office.canManage(dto.user))
                throw new NotAllowedError("Not allowed")

            office.hydrate(dto)

            return new Response().addData('office', await this.officeRepo.save(office) as Office)

        }, dto.name)
    }

    async removeMemberFromOffice(dto: MemberToOfficeDto): Promise<Response> {
        return tryCatch(async () => {
            const office = await this.officeRepo.getOrFail(dto.uid) as Office

            if (!office.canManage(dto.user)) throw new NotAllowedError("Not allowed")

            const member = await this.userRepo.getOrFail(dto.memberUid) as User
            office.members.delete(member)

            await this.officeRepo.save(office)

            return new Response()

        }, `${dto.uid} ${dto.memberUid}`)
    }

    async getOffice(dto: GetOfficeDto): Promise<Response> {
        return tryCatch(async () => {
            const office = await this.officeRepo.getOrFail(dto.uid) as Office
            if (!office.canManage(dto.user))
                throw new NotAllowedError("Not allowed")
            return new Response().addData('office', office)
        }, dto.uid)
    }


    async getOffices(dto: GetOfficesDto): Promise<Response> {
        return tryCatch(async () => {
            const association = await this.associationRepo.getOrFail(dto.associationUid) as Association
            if (!association.canManage(dto.user))
                throw new NotAllowedError("Not allowed")
            return new Response().addData('offices', association.offices)
        }, dto.associationUid)
    }

    async addMemberToOffice(dto: MemberToOfficeDto): Promise<Response> {
        return tryCatch(async () => {
            const office = await this.officeRepo.getOrFail(dto.uid) as Office

            if (!office.canManage(dto.user)) throw new NotAllowedError("Not allowed")

            const member = await this.userRepo.getOrFail(dto.memberUid) as User
            office.members.add(member)

            await this.officeRepo.save(office)

            return new Response()

        }, `${dto.uid} ${dto.memberUid}`)
    }

    async deleteOffice(dto: GetOfficeDto): Promise<Response> {
        return tryCatch(async () => {
            const office = await this.officeRepo.getOrFail(dto.uid) as Office
            if (!office.canManage(dto.user))
                throw new NotAllowedError("Not allowed")

            await this.officeRepo.remove(office)

            return new Response()

        }, dto.uid)
    }

    async createOffice(dto: CreateOfficeDto): Promise<Response> {
        return tryCatch(async () => {
            const association = await this.associationRepo.getOrFail(dto.associationUid) as Association
            if (!association.isOwner(dto.user))
                throw new NotAllowedError("Not allowed")

            let office = new Office(dto)
            office.association = association
            office = await this.officeRepo.save(office) as Office

            return new Response().addData('office', office)

        }, dto.name)
    }

}