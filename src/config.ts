import * as path from 'path'
import * as fs from 'fs'
import { GameProfile, MprConfig } from './types'
import Logger from './logger'
import { MPR_CONFIG_FILENAME } from './constants'

const logger = Logger.getInstance('Config')

export function readConfigFile(homeDir: string): MprConfig {
  try {
    const configPath = path.join(homeDir, MPR_CONFIG_FILENAME)
    if (!fs.existsSync(configPath)) {
      logger.red('Config file has not been found at ' + configPath)
      process.exit(1)
    }
    const rawData = fs.readFileSync(configPath)
    const config: MprConfig = JSON.parse(rawData.toString())
    validateConfigFile(config)
    return config
  } catch (e) {
    logger.red('Could not parse config file.')
    logger.def(e)
    process.exit(1)
  }
}

function validateConfigFile(config: MprConfig): void {
  if (!config?.profiles?.length) {
    logger.red('No profiles found.')
    process.exit(1)
  }
  if (config.profiles.filter(p => p.isDefault).length !== 1) {
    logger.red('You need to have exactly 1 default profile.')
    process.exit(1)
  }
  config.profiles.forEach(
    ({ name, abbreviation, bindings, keywords, shortName }: GameProfile, index: number) => {
      if (
        !name ||
        typeof name !== 'string' ||
        !abbreviation ||
        typeof abbreviation !== 'string' ||
        !shortName ||
        typeof shortName !== 'string' ||
        !keywords?.length ||
        keywords.some(word => typeof word !== 'string') ||
        !bindings ||
        !Object.values(bindings).some(binding => typeof binding !== 'string')
      ) {
        logger.red(`Invalid profile on index ${index}`)
        process.exit(1)
      }
    }
  )
}
