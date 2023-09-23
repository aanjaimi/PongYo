import type { Channel } from "./Channel"

export type User = {
  id:            string
  firstName?:     string
  lastName?:      string
  userName:      string
  email?:         string
  cover?:         string
  avatar?:         string
  twoFactorAuth?: boolean
  channels:      Channel[]
}