import { spawnSync } from 'node:child_process'

const command = 'python3'
const args = [
  '-m',
  'jupyter',
  'nbconvert',
  '--to',
  'html',
  '--output-dir',
  'public',
  '--output',
  'explainer-notebook',
  'explainer_notebook.ipynb',
]

const result = spawnSync(command, args, {
  stdio: 'inherit',
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
