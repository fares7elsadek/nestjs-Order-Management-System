import * as bcrypt from 'bcryptjs';

export class BcryptService {
    private readonly saltRounds = 10;
  
    async hashPassword(password: string): Promise<string> {
      return await bcrypt.hash(password, this.saltRounds);
    }
  
    async comparePasswords(password: string, hash: string): Promise<boolean> {
      return await bcrypt.compare(password, hash);
    }
}