import { config } from '@vue/test-utils';

// Keep component tests deterministic: no transition delays.
config.global.stubs = { transition: false, 'transition-group': false };
