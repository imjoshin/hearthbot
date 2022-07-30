import { spawn } from "child_process"
import chalk from "chalk"

type ExecOptions = {
  silent?: boolean
  cwd?: string
}

export const exec = (cmd: string, { silent, cwd }: ExecOptions = {}) => {
  return new Promise<void>((res, rej) => {
    const [command, ...params] = cmd.trim().split(/\s+/)

    console.log(chalk.gray(`$ ${command} ${params.join(' ')}`))

    const p = spawn(command, params, {cwd})

    if (!silent) {
      p.stdout.on('data', function (data) {
        const lines = data.toString().trim().split('\n')
        console.log("    " + chalk.gray(lines.join('\n    ')));
      });
      
      p.stderr.on('data', function (data) {
        const lines = data.toString().trim().split('\n')
        console.error("    " + chalk.red(lines.join('\n    ')));
      });
    }
  
    p.on('exit', function (code) {
      code ? rej() : res()
    });
  })
}