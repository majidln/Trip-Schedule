import { EditTripDto, CreateTripDto } from './dto/trip.dto';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { TripService } from './trip.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from './../auth/decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@Controller('trips')
@ApiBearerAuth()
@ApiTags('Trips')
export class TripController {
  constructor(private tripService: TripService) {}

  @Get()
  getList(@GetUser('id') userId: number) {
    return this.tripService.getTripList(userId);
  }

  @Get(':id')
  getItem(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) tripId: number,
  ) {
    return this.tripService.getTripById(userId, tripId);
  }

  @Post()
  create(@GetUser('id') userId: number, @Body() dto: CreateTripDto) {
    return this.tripService.createTrip(userId, dto);
  }

  @Patch(':id')
  edit(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) tripId: number,
    @Body() dto: EditTripDto,
  ) {
    return this.tripService.updateTrip(userId, tripId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) tripId: number,
  ) {
    return this.tripService.deleteTrip(userId, tripId);
  }
}
