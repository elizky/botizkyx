const PASSWORD = process.env.DASHBOARD_PASSWORD || 'botizkyx2024'

export function verifyPassword(password: string): boolean {
  return password === PASSWORD
}

export function createSession() {
  return 'authenticated'
}
