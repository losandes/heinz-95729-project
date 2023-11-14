#!/usr/bin/env node
import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Checks for the existence of a file
 * @param {string} fileLocation
 * @returns {Promise<boolean>}
 */
const exists = async (fileLocation) => {
  try {
    const stats = await stat(fileLocation)

    return stats.isDirectory() || stats.isFile()
  } catch (e) {
    return false
  }
}

const MESSAGES = {
  CREATED_DIRECTORY: 'CREATED DIRECTORY:',
  CREATED_FILE: 'CREATED FILE:',
  SKIPPED_FILE: {
    EXISTS: 'SKIPPED (already exists):',
    SOURCE_MISSING: 'SKIPPED (source file does not exist):',
  }
}

const printMessage = {
  createdDir: (dirLocation) => console.log(MESSAGES.CREATED_DIRECTORY, dirLocation),
  createdFile: (fileLocation) => console.log(MESSAGES.CREATED_FILE, fileLocation),
  skipped: {
    exists: (fileLocation) => console.log(MESSAGES.SKIPPED_FILE.EXISTS, fileLocation),
    sourceMissing: (sourceFileLocation) => console.log(MESSAGES.SKIPPED_FILE.SOURCE_MISSING, sourceFileLocation),
  }
}

const PATHS = {
  DATA_VOLUMES: path.join(process.cwd(), 'api', 'data_volumes'),
  DATA_FILE: path.join(process.cwd(), 'api', 'data_volumes', 'heinz-95729.db'),
  ENV_EXAMPLE: path.join(process.cwd(), '.env.example'),
  ENV: path.join(process.cwd(), '.env'),
}

const EXISTS = {
  DATA_VOLUMES: await exists(PATHS.DATA_VOLUMES),
  DATA_FILE: await exists(PATHS.DATA_FILE),
  ENV_EXAMPLE: await exists(PATHS.ENV_EXAMPLE),
  ENV: await exists(PATHS.ENV),
}

if (!EXISTS.DATA_VOLUMES) {
  await mkdir(PATHS.DATA_VOLUMES)
  printMessage.createdDir(PATHS.DATA_VOLUMES)
} else {
  printMessage.skipped.exists(PATHS.DATA_VOLUMES)
}

if (!EXISTS.DATA_FILE) {
  await writeFile(PATHS.DATA_FILE, '')
  printMessage.createdFile(PATHS.DATA_FILE)
} else {
  printMessage.skipped.exists(PATHS.DATA_FILE)
}

if (EXISTS.ENV_EXAMPLE && !EXISTS.ENV) {
  await copyFile(PATHS.ENV_EXAMPLE, PATHS.ENV)
  printMessage.createdFile(PATHS.ENV)
} else if (!EXISTS.ENV_EXAMPLE) {
  printMessage.skipped.sourceMissing(PATHS.ENV_EXAMPLE)
} else if (EXISTS.ENV) {
  printMessage.skipped.exists(PATHS.ENV)
}
