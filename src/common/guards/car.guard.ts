import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OfficeService } from "../../office/office.service";
import { Office } from "../../office/models/office.model";

@Injectable()
export class CarGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly officeService: OfficeService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException("Unauthorized user");
    }

    const [bearer, token] = authHeaders.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedException("Unauthorized user");
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    if (!payload) {
      throw new UnauthorizedException("Unauthorized user");
    }

    if (payload.is_active !== true && payload.is_owner !== true) {
      throw new ForbiddenException({
        message: "Sizda bunday huquq yo'q!, Active emassiz!",
      });
    }

    const officeId = req.body.office_id;
    const office = await this.officeService.findOne(officeId);

    if (!office || !(office instanceof Office)) {
      throw new ForbiddenException("Office topilmadi yoki noto'g'ri turda!");
    }

    const owner_id = office.owner_id;

    if (payload.id !== owner_id) {
      throw new ForbiddenException("Siz faqat o'zingizni boshqara olasiz!");
    }

    if (payload.is_active !== true && payload.is_owner == !true) {
      throw new ForbiddenException({
        message: "Sizda bunday huquq yo'q!, Active emassiz!",
      });
    }

    return true;
  }
}
