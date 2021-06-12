import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/crypto/hash-comparer'
import { Hasher } from '../../../data/protocols/crypto/hasher'

export class BCryptAdapter implements Hasher, HashComparer {
  constructor(private readonly saltRounds: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.saltRounds)
    return hash
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
