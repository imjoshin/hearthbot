import { Client, ActivityOptions } from "discord.js"
import * as constants from "../constants"

export const onAcitivityRotate = (client: Client) => {
  const weightMap: number[] = []

  constants.BOT.ACTIVITIES.forEach((activity, index) => {
    for (let i = 0; i < activity.weight; i++) {
      weightMap.push(index)
    }
  })

  const index = weightMap[Math.floor(Math.random() * weightMap.length)]
  const activity = constants.BOT.ACTIVITIES[index]

  client.user.setActivity(
    activity.name, 
    { 
      // @ts-ignore
      type: activity.type
    }
  )
}