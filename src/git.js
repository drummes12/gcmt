import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

function cleanStdout (stdout) {
  return stdout.trim().split('\n').filter(Boolean)
}

export async function getChangedFiles () {
  const { stdout } = await execAsync('git status --porcelain')
  return cleanStdout(stdout).map((line) => line.split(' ').at(-1))
}

export async function getStagedFiles () {
  const { stdout } = await execAsync('git diff --cached --name-only')
  return cleanStdout(stdout)
}

export async function gitAdd ({ files = [] } = {}) {
  const filesLine = files.join(' ')
  const { stdout } = await execAsync(`git add ${filesLine}`)
  return cleanStdout(stdout)
}

export async function gitCommit ({ commit } = {}) {
  const { stdout } = await execAsync(`git commit -m "${commit}"`)
  return cleanStdout(stdout)
}

export async function gitRestoreStaged ({ files = [] } = {}) {
  const filesLine = files.join(' ')
  const { stdout } = await execAsync(`git restore --staged ${filesLine}`)
  return cleanStdout(stdout)
}

export async function gitGetRemotes () {
  const { stdout } = await execAsync('git remote show')
  return cleanStdout(stdout)
}

export async function gitCheckRemote (remote) {
  const { stdout } = await execAsync(`git remote show ${remote}`)
  return cleanStdout(stdout)
}

export async function gitCurrentBranch () {
  const { stdout } = await execAsync('git branch --show-current')
  return cleanStdout(stdout)
}

export async function gitPush (remote, branch) {
  const { stdout } = await execAsync(`git push ${remote} ${branch}`)
  return cleanStdout(stdout)
}
