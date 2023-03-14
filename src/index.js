import { trytm } from '@bdsqqq/try'
import {
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  select,
  text
} from '@clack/prompts'
import colors from 'picocolors'

import { COMMIT_TYPES } from './commit-types.js'
import {
  getChangedFiles,
  getStagedFiles,
  gitAdd,
  gitCommit,
  gitPush,
  gitGetRemotes,
  gitCheckRemote
} from './git.js'
import { exitProgram } from './utils.js'

intro(
  colors.inverse(
    ` Asistente para la creación de commits por ${colors.yellow(
      ' @drummes12 '
    )}`
  )
)

const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

if (errorChangedFiles ?? errorStagedFiles) {
  outro(colors.red('❌ Comprueba que estás en un repositorio de git'))
  process.exit(1)
}

if (stagedFiles.length === 0 && changedFiles.length === 0) {
  outro(colors.red('❌ Nada para hacer commit'))
  process.exit(1)
}

let files = []
if (stagedFiles.length === 0 && changedFiles.length > 0) {
  files = await multiselect({
    message: `${colors.yellow('⚠️ No tienes nada para hacer commit.')}
${colors.gray('│')}
${colors.gray('│')}  ${colors.cyan(
      'Selecciona los ficheros que quieres añadir al commit:'
    )}`,
    options: changedFiles.map((file) => ({
      value: file,
      label: file
    }))
  })

  if (isCancel(files)) exitProgram({ files })

  await gitAdd({ files })
}

const commitType = await select({
  message: colors.cyan('Selecciona el tipo de commit:'),
  options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${key.padEnd(8, ' ')} • ${value.description}`
  }))
})

if (isCancel(commitType)) exitProgram({ files })

const commitMessage = await text({
  message: colors.cyan('Introduce el mensaje del commit:'),
  validate: (value) => {
    if (value.length === 0) {
      return colors.yellow('⚠️ El mensaje no puede estar vacío')
    }

    if (value.length > 50) {
      return colors.yellow('⚠️ El mensaje no puede tener más de 50 caracteres')
    }
  }
})

if (isCancel(commitMessage)) exitProgram({ files })

const { emoji, release } = COMMIT_TYPES[commitType]

let breakingChange = false
if (release) {
  breakingChange = await confirm({
    initialValue: false,
    message: `${colors.cyan(
      '¿Tiene este commit cambios que rompen la compatibilidad anterior?'
    )}
${colors.gray('│')}
${colors.gray('│')}  ${colors.yellow(
      'Si la respuestra es sí, deberías crear un commit con el tipo "BREAKING CHANGE"'
    )}`
  })

  if (isCancel(breakingChange)) exitProgram({ files })
}

let commit = `${emoji} ${commitType}: ${commitMessage}`
commit = breakingChange ? `${commit} [breaking change]` : commit

const shouldContinue = await confirm({
  initialValue: true,
  message: `¿Quieres crear el commit con el siquiente mensaje?
${colors.gray('│')}  
${colors.gray('│')}  ${colors.green(colors.bold(commit))}
${colors.gray('│')}  
${colors.gray('│')}  ${colors.cyan('¿Confirmas?')}`
})

if (isCancel(shouldContinue)) exitProgram({ files })

if (!shouldContinue) exitProgram({ code: 0, files, message: '⚠️ No se ha creado el commit' })

await gitCommit({ commit })

console.log(`${colors.gray('│')}  ✔️ Commit creado con éxito`)

const gitRemotes = await gitGetRemotes()

let gitRemote = ''
if (gitRemotes.length > 1) {
  gitRemote = await select({
    message: colors.cyan('Selecciona el repositorio remoto:'),
    options: gitRemotes.map((remote) => ({
      value: remote,
      label: remote
    }))
  })
  if (isCancel(gitRemote)) exitProgram()
} else {
  gitRemote = gitRemotes[0]
}

const [, errorCheckRemote] = await trytm(gitCheckRemote(gitRemote))

if (errorCheckRemote) {
  outro(
    colors.yellow(
      '⚠️ Por favor asegúrate de que tengas los permisos de acceso correctos para hacer push'
    )
  )
  process.exit(1)
}

const shouldPushCommit = await confirm({
  initialValue: true,
  message: colors.cyan(
    `🚀 ¿Quieres hacer push de este commit a ${colors.yellow(gitRemote)}?`
  )
})

if (isCancel(shouldPushCommit)) exitProgram()

if (shouldPushCommit) {
  await gitPush(gitRemote)
}

outro(colors.green('✅ ¡Gracia por usar el asistente!'))
