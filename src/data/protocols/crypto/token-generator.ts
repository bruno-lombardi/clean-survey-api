export interface TokenGenerator {
  generateToken: (value: string) => Promise<string>
}
