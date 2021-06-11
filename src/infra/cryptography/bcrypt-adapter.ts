import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/crypto/encrypter'

export class BCryptAdapter implements Encrypter {
  constructor(private readonly saltRounds: number) {}

  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.saltRounds)
    return hash
  }
}
