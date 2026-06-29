import { environment } from '@config/env';
import { getEnvAsNumber } from '@config/env-helper';

interface TimeoutsConfig {
  test: number;
  expect: number;
  actions: number;
}

const DEFAULT_TIMEOUTS = {
  TEST: 60_000,
  EXPECT: 10_000,
  ACTIONS: 30_000,
};

export const TIMEOUTS: TimeoutsConfig = {
  test: getEnvAsNumber(environment.TEST_TIMEOUT, DEFAULT_TIMEOUTS.TEST),
  expect: getEnvAsNumber(environment.EXPECT_TIMEOUT, DEFAULT_TIMEOUTS.EXPECT),
  actions: getEnvAsNumber(environment.ACTIONS_TIMEOUT, DEFAULT_TIMEOUTS.ACTIONS),
};
