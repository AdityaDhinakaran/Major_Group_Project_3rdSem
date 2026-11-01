import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('public', { recursive: true, force: true });
mkdirSync('public', { recursive: true });
cpSync('client/dist', 'public', { recursive: true });
console.log('Copied the React build into Vercel public assets.');
