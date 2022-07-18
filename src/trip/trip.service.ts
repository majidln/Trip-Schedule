import { CreateTripDto, EditTripDto } from './dto/trip.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TripService {
  constructor(private prisma: PrismaService) {}

  getTripList(userId: number) {
    return this.prisma.trip.findMany({
      where: {
        userId,
      },
    });
  }

  getTripById(userId: number, tripId: number) {
    console.log('tripid is', tripId);
    return this.prisma.trip.findFirst({
      where: {
        userId,
        id: tripId,
      },
    });
  }

  async createTrip(userId: number, dto: CreateTripDto) {
    const trip = await this.prisma.trip.create({
      data: {
        ...dto,
        userId,
      },
    });
    return trip;
  }

  async updateTrip(userId: number, tripId: number, dto: EditTripDto) {
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
      },
    });

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }
    return this.prisma.trip.update({
      where: {
        id: tripId,
      },
      data: { ...dto },
    });
  }

  async deleteTrip(userId: number, tripId: number) {
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
      },
    });

    if (trip.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.trip.delete({
      where: {
        id: tripId,
      },
    });
  }
}
