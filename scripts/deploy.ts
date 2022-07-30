import * as dotenv from "dotenv"
import yargs from "yargs/yargs"
import { spawn } from "child_process"
import chalk from "chalk"

type ExecOptions = {
  silent?: boolean
  cwd?: string
}

const exec = (cmd: string, { silent, cwd }: ExecOptions = {}) => {
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

// const exec = util.promisify(require('child_process').exec)

dotenv.config()

const api = async (args: { [key: string]: any }) => {
  const {
    env,
  } = args

  console.log(chalk.yellow(`Deploying api to ${env}\n`))

  await exec(`cp .env api/.env`)

  await exec(`
    gcloud builds submit
      --tag gcr.io/${process.env.GOOGLE_PROJECT_ID}/${process.env.CLOUD_API_SERVICE}
      --project=${process.env.GOOGLE_PROJECT_ID}
  `, {cwd: 'api'})

  // TODO use this
  let deployEnv = env === 'production' ? "" : env
  deployEnv = ""

  await exec(`
    gcloud run deploy ${deployEnv} ${process.env.CLOUD_API_SERVICE}
      --image gcr.io/${process.env.GOOGLE_PROJECT_ID}/${process.env.CLOUD_API_SERVICE}
      --add-cloudsql-instances ${process.env.INSTANCE_CONNECTION_NAME}
      --update-env-vars INSTANCE_CONNECTION_NAME=${process.env.INSTANCE_CONNECTION_NAME},DB_PASS=${process.env.DB_PASS},DB_USER=${process.env.DB_USER},DB_NAME=${process.env.DB_NAME}
      --platform managed
      --region us-central1
      --allow-unauthenticated
      --project=${process.env.GOOGLE_PROJECT_ID}
  `, {cwd: 'api'})
}

yargs(process.argv.slice(2))
  .scriptName('deploy')
  .command(
    'api', 
    'api interface', 
    (yargs) => {
      return yargs
        .option('env', 
          {
            alias: 'e',
            demandOption: 'true',
            describe: 'environment to deploy to',
            choices: ['production', 'alpha'],
          })
    },
    api
  )
  .parse()