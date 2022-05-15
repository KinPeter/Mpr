export function getGameScript(abbreviation: string): string {
  return `
#!/bin/bash

source $HOME/code/linux/bash-mouse.sh
mpr ${abbreviation}
notify-send "G502 Profile set to 1 ($(cat $HOME/.g502gameprofile))"
`
}

export const mprGetScript = `
#!/bin/bash

source $HOME/code/linux/bash-mouse.sh
notify-send "$(mpr)"
`

export const mpr0Script = `
#!/bin/bash

source $HOME/code/linux/bash-mouse.sh
mpr 0
notify-send "G502 Profile set to 0 (Default)"
`

export const mpr1Script = `
#!/bin/bash

source $HOME/code/linux/bash-mouse.sh
mpr 1
notify-send "G502 Profile set to 1 ($(cat $HOME/.g502gameprofile))"
`
