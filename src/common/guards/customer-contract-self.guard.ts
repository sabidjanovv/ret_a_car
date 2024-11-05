import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ContractService } from "../../contract/contract.service";

@Injectable()
export class CustomerContractGetGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly contractService: ContractService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException("Unauthorized user");
    }

    const bearer = authHeaders.split(" ")[0];
    const token = authHeaders.split(" ")[1];

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

    if (payload.is_active !== true) {
      throw new ForbiddenException({
        message: "Sizda bunday huquq yo'q!, Active emassiz!",
      });
    }

    if (payload.is_customer !== true) {
      throw new ForbiddenException(
        "Sizda bunday huquq yo'q! Siz customer emassiz!"
      );
    }

    const contract = await this.contractService.findOne(req.params.id);
    const customerId = contract.customer_id;

    if (Number(customerId) !== Number(payload.id)) {
      throw new ForbiddenException(
        "Sizda bunday huquq yo'q! Siz faqat o'zingizni ma'lumotlaringizni ko'ra olasiz va o'zgartira olasiz"
      );
    }

    return true;
  }
}
