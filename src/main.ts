import { readConfigFile } from './config'
import * as os from 'os'

export function run() {
  const homeDir = os.homedir()
  const config = readConfigFile(homeDir)

  console.log(config)
}
