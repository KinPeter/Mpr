import * as path from 'path'
import * as fs from 'fs'
import { DESKTOP_FILES_FOLDER, ICON_ASSET_FOLDER, MPR_FOLDER_NAME } from './constants'
import Logger from './logger'
import { GameProfile } from './types'
import { getGameScript, mpr0Script, mpr1Script, mprGetScript } from './sh-profile-script'
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
    const filename = path.resolve(homeDir, MPR_FOLDER_NAME, 'mpr.sh')
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
    fs.writeFileSync(path.resolve(homeDir, MPR_FOLDER_NAME, 'mpr.sh'), mprGetScript)
    fs.writeFileSync(path.resolve(homeDir, MPR_FOLDER_NAME, 'mpr-0.sh'), mpr0Script)
    fs.writeFileSync(path.resolve(homeDir, MPR_FOLDER_NAME, 'mpr-1.sh'), mpr1Script)
    profiles.forEach(({ abbreviation, isDefault }) => {
      if (isDefault) return
      const script = getGameScript(abbreviation)
      const filename = path.resolve(homeDir, MPR_FOLDER_NAME, `mpr-${abbreviation}.sh`)
      fs.writeFileSync(filename, script)
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

    if (fs.existsSync(profile0DesktopFile)) fs.rmSync(profile1DesktopFile)
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
