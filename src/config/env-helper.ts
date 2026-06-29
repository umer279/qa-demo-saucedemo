import dotenv from 'dotenv';
import chalk from 'chalk';
import path from 'path';

const projectRoot = path.resolve(__dirname, '../..');

dotenv.config({
  path: process.env.test_env
    ? path.join(projectRoot, 'envs', `.env.${process.env.test_env}`)
    : path.join(projectRoot, 'envs', '.env.local'),
});

function shouldLogWarnings(): boolean {
  return (process.env.LOG_LEVEL || '').toLowerCase() === 'debug';
}

function warn(message: string): void {
  if (shouldLogWarnings()) {
    console.warn(chalk.yellow.bold('[ENV WARN]'), chalk.yellow(message));
  }
}

export function getEnv(name: string): string {
  const envValue = process.env[name];
  if (envValue == null) {
    warn(`Environment variable "${name}" is not defined.`);
    return '';
  }
  return envValue;
}

export function getEnvAsNumber(name: string, fallback: number): number {
  const envValue = process.env[name];

  if (!envValue) {
    warn(`Environment variable "${name}" is not defined. Using fallback: ${fallback}`);
    return fallback;
  }

  const parsedValue = Number(envValue);
  if (isNaN(parsedValue)) {
    warn(`Environment variable "${name}" is not a valid number. Using fallback: ${fallback}`);
    return fallback;
  }

  return parsedValue;
}
