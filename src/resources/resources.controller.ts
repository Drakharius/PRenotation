import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from "@nestjs/common";
import { ResourcesService } from "./resources.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";

@Controller("resources")
export class ResourcesController {
  constructor(
    @Inject(ResourcesService)
    private readonly resourcesServicer: ResourcesService,
  ) {}

  @Post()
  async create(@Body() createResourceDto: CreateResourceDto) {
    return await this.resourcesServicer.create(createResourceDto);
  }

  @Get()
  async findAll() {
    return await this.resourcesServicer.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return await this.resourcesServicer.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return await this.resourcesServicer.update(id, updateResourceDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return await this.resourcesServicer.delete(id);
  }
}
