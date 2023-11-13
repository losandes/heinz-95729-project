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
  SERVER_ENV_EXAMPLE: path.join(process.cwd(), 'api', '.env.example'),
  SERVER_ENV: path.join(process.cwd(), 'api', '.env'),
  CLIENT_ENV_EXAMPLE: path.join(process.cwd(), 'client', '.env.example'),
  CLIENT_ENV: path.join(process.cwd(), 'client', '.env'),
}

const EXISTS = {
  DATA_VOLUMES: await exists(PATHS.DATA_VOLUMES),
  DATA_FILE: await exists(PATHS.DATA_FILE),
  SERVER_ENV_EXAMPLE: await exists(PATHS.SERVER_ENV_EXAMPLE),
  SERVER_ENV: await exists(PATHS.SERVER_ENV_EXAMPLE),
  CLIENT_ENV_EXAMPLE: await exists(PATHS.CLIENT_ENV_EXAMPLE),
  CLIENT_ENV: await exists(PATHS.CLIENT_ENV_EXAMPLE),
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

if (EXISTS.SERVER_ENV_EXAMPLE && !EXISTS.SERVER_ENV) {
  const result = await copyFile(PATHS.SERVER_ENV_EXAMPLE, PATHS.SERVER_ENV)
  printMessage.createdFile(PATHS.SERVER_ENV)
} else if (!EXISTS.SERVER_ENV_EXAMPLE) {
  printMessage.skipped.sourceMissing(PATHS.SERVER_ENV_EXAMPLE)
} else if (EXISTS.SERVER_ENV) {
  printMessage.skipped.exists(PATHS.SERVER_ENV)
}

if (EXISTS.CLIENT_ENV_EXAMPLE && !EXISTS.CLIENT_ENV) {
  const result = await copyFile(PATHS.CLIENT_ENV_EXAMPLE, PATHS.CLIENT_ENV)
  printMessage.createdFile(PATHS.CLIENT_ENV)
} else if (!EXISTS.CLIENT_ENV_EXAMPLE) {
  printMessage.skipped.sourceMissing(PATHS.CLIENT_ENV_EXAMPLE)
} else if (EXISTS.CLIENT_ENV) {
  printMessage.skipped.exists(PATHS.CLIENT_ENV)
}
