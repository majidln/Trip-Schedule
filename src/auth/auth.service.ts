import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return { msg: "I'm in signup" };
  }

  signin() {
    return { msg: "I'm in signin" };
  }
}
