import { resolve } from 'node:path';

const dotEnvConfigFileName =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

export function getDotEnvConfigFilePath(): string {
  return resolve(process.cwd(), 'config', dotEnvConfigFileName);
}
