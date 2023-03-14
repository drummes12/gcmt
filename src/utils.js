import { outro } from '@clack/prompts'
import colors from 'picocolors'

import { gitRestoreStaged } from './git.js'

export function exitProgram ({
  code = 0,
  message = '🛑 No se ha creado el commit',
  files = []
} = {}) {
  if (files.length > 0) {
    gitRestoreStaged({ files })
  }
  outro(colors.yellow(message))
  process.exit(code)
}
