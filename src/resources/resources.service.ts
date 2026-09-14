import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ResourcesService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async create(data: CreateResourceDto) {
    const resource = await this.prismaService.db.orm.public.Resource.create({
      description: data.description,
      price: data.price,
      resource: data.resource,
    });
    return resource;
  }
  async findAll() {
    const resources = await this.prismaService.db.orm.public.Resource.all();
    return resources;
  }

  async findOne(resourceId: number) {
    const resource = await this.prismaService.db.orm.public.Resource.where({
      id: resourceId,
    }).first();

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }
    return resource;
  }

  async update(resourceId: number, updateResourceDto: UpdateResourceDto) {
    const resourceUpdate =
      await this.prismaService.db.orm.public.Resource.where({
        id: resourceId,
      }).update(updateResourceDto);

    if (!resourceUpdate) {
      throw new NotFoundException("Resource not found");
    }

    return resourceUpdate;
  }

  async delete(resourceId: number) {
    const resource = await this.prismaService.db.orm.public.Resource.where({
      id: resourceId,
    }).delete();

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }
    return console.log("Resource deleted successfully");
  }
}
