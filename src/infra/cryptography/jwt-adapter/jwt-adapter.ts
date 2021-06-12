import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/crypto/encrypter'

export class JwtAdapter implements Encrypter {
  constructor(private readonly secretOrPrivateKey: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secretOrPrivateKey)
    return token
  }
}
