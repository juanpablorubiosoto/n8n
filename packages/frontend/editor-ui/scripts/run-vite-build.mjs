#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const pkgDir = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'..',
);

const env = {
	...process.env,
};

if (!env.VUE_APP_PUBLIC_PATH) {
	env.VUE_APP_PUBLIC_PATH = '/{{BASE_PATH}}/';
}

if (!env.NODE_OPTIONS) {
	env.NODE_OPTIONS = '--max-old-space-size=8192';
}

const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const child = spawn(pnpmCmd, ['exec', 'vite', 'build'], {
	cwd: pkgDir,
	env,
	stdio: 'inherit',
});

child.on('exit', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}
	process.exit(code ?? 0);
});
