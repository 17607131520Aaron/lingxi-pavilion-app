/**
 * Central place to define settings keys.
 *
 * Add keys here to keep them consistent across the app.
 */
export const SettingKeys = {
  // Example:
  // onboardingCompleted: 'onboarding_completed',
} as const;

/**
 * If you define keys in `SettingKeys`, prefer using:
 * `typeof SettingKeys[keyof typeof SettingKeys]`.
 *
 * We keep this as `string` so the module is usable immediately,
 * and you can progressively type it by filling `SettingKeys`.
 */
export type SettingKey = string;
