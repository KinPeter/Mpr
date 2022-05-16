import * as path from 'path'
import * as fs from 'fs'
import { MPR_FOLDER_NAME } from './constants'
import Logger from './logger'
import { GameProfile } from './types'
import { getGameScript, mpr0Script, mpr1Script, mprGetScript } from './sh-profile-script'
import { ValidateFunction } from 'ajv'

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
  } catch (e) {
    logger.red('Could not generate desktop files.')
    logger.def(e)
    process.exit(1)
  }
}

export function copyIconFile(homeDir: string): void {
  try {
  } catch (e) {
    logger.red('Could not generate icon file.')
    logger.def(e)
    process.exit(1)
  }
}
