import { readConfigFile } from './config'
import * as os from 'os'
import { generateMainScript } from './sh-main-script'
import {
  copyIconFile,
  createDesktopFiles,
  createMainScriptFile,
  createProfileScriptFiles,
  prepareFolder,
  updateBashRc,
} from './files'

export function run() {
  const homeDir = os.homedir()
  const { profiles } = readConfigFile(homeDir)
  const mainScriptContent = generateMainScript(profiles)
  prepareFolder(homeDir)
  copyIconFile(homeDir)
  createMainScriptFile(mainScriptContent, homeDir)
  createProfileScriptFiles(profiles, homeDir)
  createDesktopFiles(profiles, homeDir)
  updateBashRc(homeDir)
}
