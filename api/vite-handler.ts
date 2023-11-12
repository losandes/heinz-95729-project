import type express from 'express'
import { app } from './index'

export const handler: ReturnType<typeof express> = app
