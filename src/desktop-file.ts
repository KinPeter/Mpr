import { GameProfile } from './types'

export function getGameDesktopFile(
  { name, abbreviation, keywords }: GameProfile,
  homeDir: string
): string {
  return `[Desktop Entry]
Version=1.0
Name=Mpr ${name}
Icon=${homeDir}/.local/share/icons/g.svg
Comment="Configure mouse profile for game ${name}"
Exec=${homeDir}/.mpr/mpr-${abbreviation}.sh
Type=Application
Categories=Utilities;
Keywords=${keywords.join(',')}
Terminal=false
`
}

export function getMprGetDesktopFile(homeDir: string): string {
  return `[Desktop Entry]
Version=1.0
Name=Mpr
Icon=${homeDir}/.local/share/icons/g.svg
Comment="Get mouse profile"
Exec=${homeDir}/.mpr/mpr.sh
Type=Application
Categories=Utilities;
Keywords=mprget
Terminal=false
`
}

export function getProfile0DesktopFile(homeDir: string): string {
  return `[Desktop Entry]
Version=1.0
Name=Mpr 0
Icon=${homeDir}/.local/share/icons/g.svg
Comment="Set mouse profile to 0"
Exec=${homeDir}/.mpr/mpr-0.sh
Type=Application
Categories=Utilities;
Keywords=mpr0
Terminal=false
`
}

export function getProfile1DesktopFile(homeDir: string): string {
  return `[Desktop Entry]
Version=1.0
Name=Mpr 1
Icon=${homeDir}/.local/share/icons/g.svg
Comment="Set mouse profile to 1"
Exec=${homeDir}/.mpr/mpr-1.sh
Type=Application
Categories=Utilities;
Keywords=mpr1
Terminal=false  
`
}
