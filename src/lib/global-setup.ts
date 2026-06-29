export default async function globalSetup(): Promise<void> {
  const profile = process.env.test_env ?? 'local';
  console.log(`[saucedemo-qa] Global setup — env profile: ${profile}`);
}
