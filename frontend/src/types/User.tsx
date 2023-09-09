import type { Channel } from "./Channel"

export type User = {
  id:            string
  firstName?:     string
  lastName?:      string
  username:      string
  email?:         string
  cover?:         string
  avatar?:         string
  twoFactorAuth?: boolean
  channels:      Channel[]
}