import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/crypto/hasher'

export class BCryptAdapter implements Hasher {
  constructor(private readonly saltRounds: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.saltRounds)
    return hash
  }
}
