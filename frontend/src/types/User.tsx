import type { Channel } from "./Channel"

export type User = {
  id:            string
  displayName:   string
  login?:         string
  email?:         string
  cover?:         string
  avatar?:         string
  twoFactorAuth?: boolean
  channels:      Channel[]
}