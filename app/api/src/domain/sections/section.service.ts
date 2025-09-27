import { SectionRepository } from "./section.repository";
import Response from "../../utils/response.utils";
import { tryCatch } from "../../utils/functions.utils";
import Section from "./section.entity";
import User from "../users/user.entity";
import {CreateSectionDto, UpdateSectionDto} from "./section.schema";

export default class SectionService {
  constructor(private readonly sectionRepo: SectionRepository = new SectionRepository()) {
  }

  async getSection(uid: string): Promise<Response> {
    return tryCatch(async () => {
      const section = await this.sectionRepo.getOrFail(uid);
      return new Response().addData("section", section);
    }, uid);
  }

  async getSections(user: User): Promise<Response> {
    return tryCatch(async () => {
      let sections = [];
      if (user.isAdmin())
        sections = await this.sectionRepo.findAll();
      else
        sections = await this.sectionRepo.findPublished();
      return new Response().addData("sections", sections);
    }, "Get sections");
  }

  async deleteSection(uid: string): Promise<Response> {
    return tryCatch(async () => {
      await this.sectionRepo.deleteBy("uid", uid);
      return new Response();
    }, uid);
  }

  async updateSection(dto: UpdateSectionDto): Promise<Response> {
    return tryCatch(async () => {
      const sectionExist = async (): Promise<boolean> => {
        const section = await this.sectionRepo.findByName(dto.name);
        return section instanceof Section && section.uid !== dto.uid;
      };

      if (await sectionExist())
        return new Response().addError("section_exist", "Section name or code already used");

      let section = await this.sectionRepo.getOrFail(dto.uid) as Section;
      section.description = dto.description;
      section.name = dto.name;
      section.active = dto.active;
      section = await this.sectionRepo.save(section) as Section;

      return new Response().addData("section", section);

    }, dto.uid);
  }

  async createSection(dto: CreateSectionDto): Promise<Response> {
    return tryCatch(async () => {
      const sectionExist = async (): Promise<boolean> => {
        const section = await this.sectionRepo.findByName(dto.name);
        return section instanceof Section;
      };
      if (await sectionExist())
        return new Response().addError("section_exist", "Section already created");

      let section = new Section(dto);
      section = await this.sectionRepo.save(section) as Section;

      return new Response().addData("section", section);
    }, dto.name);
  }
}