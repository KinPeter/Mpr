import {
  redBright as chalkRedBright,
  green as chalkGreen,
  blueBright as chalkBlueBright,
  cyan as chalkCyan,
} from 'chalk'

export interface LoggerInstance {
  red: (message: string | unknown) => void
  green: (message: string | unknown) => void
  blue: (message: string | unknown) => void
  cyan: (message: string | unknown) => void
  def: (message: string | unknown) => void
  linebreak: () => void
}

function getInstance(module?: string): LoggerInstance {
  return {
    red(message: string | unknown): void {
      console.log(chalkRedBright(`[MPR:${module}] ${message}`))
    },
    green(message: string | unknown): void {
      console.log(chalkGreen(`[MPR:${module}] ${message}`))
    },
    blue(message: string | unknown): void {
      console.log(chalkBlueBright(`[MPR:${module}] ${message}`))
    },
    cyan(message: string | unknown): void {
      console.log(chalkCyan(`[MPR:${module}] ${message}`))
    },
    def(message: string | unknown): void {
      console.log(`[MPR:${module}] ${message}`)
    },
    linebreak(): void {
      console.log('\n')
    },
  }
}

export default {
  getInstance,
}
