import * as dotenv from "dotenv"
import yargs from "yargs/yargs"
import chalk from "chalk"
import { exec } from "./util"

dotenv.config()

const api = async (args: { [key: string]: any }) => {
  const {
    env,
  } = args

  console.log(chalk.yellow(`Deploying api to ${env}\n`))

  await exec(`
    gcloud builds submit
      --tag gcr.io/${process.env.GOOGLE_PROJECT_ID}/${process.env.CLOUD_API_SERVICE}
      --project=${process.env.GOOGLE_PROJECT_ID}
  `, {cwd: `api`})

  // TODO use this
  let deployEnv = env === `production` ? `` : env
  deployEnv = ``

  await exec(`
    gcloud run deploy ${deployEnv} ${process.env.CLOUD_API_SERVICE}
      --image gcr.io/${process.env.GOOGLE_PROJECT_ID}/${process.env.CLOUD_API_SERVICE}
      --add-cloudsql-instances ${process.env.INSTANCE_CONNECTION_NAME}
      --update-env-vars INSTANCE_CONNECTION_NAME=${process.env.INSTANCE_CONNECTION_NAME},DB_PASS=${process.env.DB_PASS},DB_USER=${process.env.DB_USER},DB_NAME=${process.env.DB_NAME}
      --platform managed
      --region us-central1
      --allow-unauthenticated
      --project=${process.env.GOOGLE_PROJECT_ID}
  `, {cwd: `api`})
}

yargs(process.argv.slice(2))
  .scriptName(`deploy`)
  .command(
    `api`, 
    `api interface`, 
    (yargs) => {
      return yargs
        .option(`env`, 
          {
            alias: `e`,
            demandOption: `true`,
            describe: `environment to deploy to`,
            choices: [`production`, `alpha`],
          })
    },
    api
  )
  .parse()