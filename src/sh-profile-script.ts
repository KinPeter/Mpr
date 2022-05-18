export function getGameScript(abbreviation: string, mainScriptPath: string): string {
  return `#!/bin/bash

source ${mainScriptPath}
mpr ${abbreviation}
notify-send "G502 Profile set to 1 ($(cat $HOME/.g502gameprofile))"
`
}

export function getMprGetScript(mainScriptPath: string): string {
  return `#!/bin/bash

source ${mainScriptPath}
notify-send "$(mpr)"
`
}

export function getMpr0Script(mainScriptPath: string): string {
  return `#!/bin/bash

source ${mainScriptPath}
mpr 0
notify-send "G502 Profile set to 0 (Default)"
`
}

export function getMpr1Script(mainScriptPath: string): string {
  return `#!/bin/bash

source ${mainScriptPath}
mpr 1
notify-send "G502 Profile set to 1 ($(cat $HOME/.g502gameprofile))"
`
}
