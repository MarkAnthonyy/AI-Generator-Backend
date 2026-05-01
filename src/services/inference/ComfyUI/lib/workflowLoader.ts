import fs from 'fs';
import path from 'path';

export function loadWorkflowTemplate(filename: string) {
  try {
    const filePath = path.resolve(__dirname, '../../../../workflows', filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error('Failed to load workflow', { cause: err });
  }
}
