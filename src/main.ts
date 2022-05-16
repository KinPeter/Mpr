import { readConfigFile } from './config'
import * as os from 'os'
import { generateMainScript } from './sh-main-script'
import { createMainScriptFile, createProfileScriptFiles, prepareFolder } from './files'

export function run() {
  const homeDir = os.homedir()
  const { profiles } = readConfigFile(homeDir)
  const mainScriptContent = generateMainScript(profiles)
  prepareFolder(homeDir)
  createMainScriptFile(mainScriptContent, homeDir)
  createProfileScriptFiles(profiles, homeDir)
}
