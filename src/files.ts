import * as path from 'path'
import * as fs from 'fs'
import {
  DESKTOP_FILES_FOLDER,
  ICON_ASSET_FOLDER,
  MAIN_SCRIPT_NAME,
  MPR_FOLDER_NAME,
} from './constants'
import Logger from './logger'
import { GameProfile } from './types'
import { getGameScript, getMpr0Script, getMpr1Script, getMprGetScript } from './sh-profile-script'
import { gIcon } from './g-icon'
import {
  getGameDesktopFile,
  getMprGetDesktopFile,
  getProfile0DesktopFile,
  getProfile1DesktopFile,
} from './desktop-file'

const logger = Logger.getInstance('Files')

export function prepareFolder(homeDir: string): void {
  try {
    const folderPath = path.resolve(homeDir, MPR_FOLDER_NAME)
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true })
      logger.blue(`Old profiles have been removed.`)
    }
    fs.mkdirSync(folderPath)
    logger.green(`MPR folder created: ${folderPath}`)
  } catch (e) {
    logger.red('Could not clear or create MPR folder.')
    logger.def(e)
    process.exit(1)
  }
}

export function createMainScriptFile(content: string, homeDir: string): void {
  try {
    const filename = path.resolve(homeDir, MPR_FOLDER_NAME, MAIN_SCRIPT_NAME)
    if (fs.existsSync(filename)) {
      fs.rmSync(filename)
    }
    fs.writeFileSync(filename, content)
    logger.green(`Main script file generated: ${filename}`)
  } catch (e) {
    logger.red('Could not generate main script file.')
    logger.def(e)
    process.exit(1)
  }
}

export function createProfileScriptFiles(profiles: GameProfile[], homeDir: string): void {
  try {
    const mainScriptPath = path.resolve(homeDir, MPR_FOLDER_NAME, MAIN_SCRIPT_NAME)
    fs.writeFileSync(
      path.resolve(homeDir, MPR_FOLDER_NAME, 'mpr.sh'),
      getMprGetScript(mainScriptPath),
      { mode: 0o775 }
    )
    fs.writeFileSync(
      path.resolve(homeDir, MPR_FOLDER_NAME, 'mpr-0.sh'),
      getMpr0Script(mainScriptPath),
      { mode: 0o775 }
    )
    fs.writeFileSync(
      path.resolve(homeDir, MPR_FOLDER_NAME, 'mpr-1.sh'),
      getMpr1Script(mainScriptPath),
      { mode: 0o775 }
    )
    profiles.forEach(({ abbreviation, isDefault }) => {
      if (isDefault) return
      const script = getGameScript(abbreviation, mainScriptPath)
      const filename = path.resolve(homeDir, MPR_FOLDER_NAME, `mpr-${abbreviation}.sh`)
      fs.writeFileSync(filename, script, { mode: 0o775 })
    })
    logger.green('Game profile scripts generated.')
  } catch (e) {
    logger.red('Could not generate profile script files.')
    logger.def(e)
    process.exit(1)
  }
}

export function createDesktopFiles(profiles: GameProfile[], homeDir: string): void {
  try {
    const desktopFolder = path.resolve(homeDir, DESKTOP_FILES_FOLDER)
    if (!fs.existsSync(desktopFolder)) {
      fs.mkdirSync(desktopFolder, { recursive: true })
    }
    const mprDesktopFile = path.resolve(desktopFolder, 'mpr.desktop')
    const profile0DesktopFile = path.resolve(desktopFolder, 'mpr-0.desktop')
    const profile1DesktopFile = path.resolve(desktopFolder, 'mpr-1.desktop')

    if (fs.existsSync(mprDesktopFile)) fs.rmSync(mprDesktopFile)
    fs.writeFileSync(mprDesktopFile, getMprGetDesktopFile(homeDir))

    if (fs.existsSync(profile0DesktopFile)) fs.rmSync(profile0DesktopFile)
    fs.writeFileSync(profile0DesktopFile, getProfile0DesktopFile(homeDir))

    if (fs.existsSync(profile1DesktopFile)) fs.rmSync(profile1DesktopFile)
    fs.writeFileSync(profile1DesktopFile, getProfile1DesktopFile(homeDir))

    profiles.forEach(profile => {
      if (profile.isDefault) return
      const { abbreviation } = profile
      const gameDesktopFile = path.resolve(desktopFolder, `mpr-${abbreviation}.desktop`)
      const desktopFileContent = getGameDesktopFile(profile, homeDir)

      if (fs.existsSync(gameDesktopFile)) fs.rmSync(gameDesktopFile)
      fs.writeFileSync(gameDesktopFile, desktopFileContent)
    })
    logger.green(`Desktop files generated.`)
  } catch (e) {
    logger.red('Could not generate desktop files.')
    logger.def(e)
    process.exit(1)
  }
}

export function copyIconFile(homeDir: string): void {
  try {
    const iconFolder = path.resolve(homeDir, ICON_ASSET_FOLDER)
    if (!fs.existsSync(iconFolder)) {
      fs.mkdirSync(iconFolder, { recursive: true })
    }
    const iconFile = path.resolve(iconFolder, 'g.svg')
    if (fs.existsSync(iconFile)) {
      logger.cyan(`Icon file already exists at ${iconFile}`)
      return
    }
    fs.writeFileSync(iconFile, gIcon)
    logger.green(`Created icon file at ${iconFile}`)
  } catch (e) {
    logger.red('Could not generate icon file.')
    logger.def(e)
    process.exit(1)
  }
}

export function updateBashRc(homeDir: string): void {
  try {
    const bashRcPath = path.resolve(homeDir, '.bashrc')
    const bashRcContent = fs.readFileSync(bashRcPath).toString().split('\n')
    const regex = new RegExp(/source\s.+(?=\.mpr\/mpr-main.sh)/)
    if (!bashRcContent.some(line => regex.test(line))) {
      bashRcContent.push(
        '# Load mouse profiler scripts',
        `source ${path.resolve(homeDir, MPR_FOLDER_NAME, MAIN_SCRIPT_NAME)}`
      )
      const newContent = bashRcContent.join('\n')
      fs.writeFileSync(bashRcPath, newContent)
      logger.green('Updated Bash config.')
    } else {
      logger.cyan('Bash config already includes the MPR script.')
    }
  } catch (e) {
    logger.red('Could not update .bashrc')
    logger.def(e)
    process.exit(1)
  }
}
