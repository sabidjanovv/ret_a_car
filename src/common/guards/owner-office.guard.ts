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
export class OwnerOfficeGuard implements CanActivate {
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

    if (payload.is_active !== true && payload.is_owner == !true) {
      throw new ForbiddenException({
        message: "Sizda bunday huquq yo'q!, Active emassiz!",
      });
    }

    // if (req.body.owner_id !== payload.id){}

    const officeId = req.params.id;
    const office = await this.officeService.findOne(+officeId);

    // Office obyektini aniqlash
    if (!(office instanceof Office) || office.owner_id !== payload.id) {
      throw new ForbiddenException(
        "Siz faqat o'zingizni office'laringizni ko'ra olasiz!"
      );
    }

    return true;
  }
}
