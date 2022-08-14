import { GameProfile } from './types'

export function generateMainScript(profiles: GameProfile[]): string {
  let content = `#!/bin/bash

g502mouseName=""

function mpr {
  local profile=$1

  if [[ $# == 0 ]]; then
    mpr-get`

  profiles.forEach(({ isDefault, abbreviation, shortName }) => {
    if (isDefault) return
    content += `
  elif [[ $profile == "${abbreviation}" ]]; then
    mpr-configureAndSet${shortName}`
  })

  content += `
  else
    mpr-set $profile
  fi
}

function getMyMouseName {
  local listItem=$(ratbagctl list | grep 'G502')
  IFS=':'
  read -a mouseName <<< "$listItem"
  unset IFS
  g502mouseName=$mouseName
}

# Set the mouse profile to 0, 1 or 2
function mpr-set {
  local profile=$1
  if [[ $profile != 0 && $profile != 1 && $profile != 2 ]]; then
    echo "Profile not available"
    return 1
  fi

  getMyMouseName
  ratbagctl $g502mouseName profile active set $profile
  if [[ $profile == 0 ]]; then
    echo "G502 Profile set to $profile (Default)"
    echo "0" > $HOME/.g502activeprofile
  else
    local game=$(<$HOME/.g502gameprofile)
    echo "G502 Profile set to $profile ($game)"
    echo "1" > $HOME/.g502activeprofile
  fi
  return 0
}

function mpr-get {
  getMyMouseName
  local profile=$(ratbagctl $g502mouseName profile active get)
  local game=$(<$HOME/.g502gameprofile)
  if [[ $profile == 0 ]]; then
    echo "G502 active profile is $profile (Default)"
    echo "Profile 1 is set to $game"
  else
    echo "G502 active profile is set to $game"
  fi
}

# Buttons on the G502
# 0 left
# 1 right
# 2 middle
# 3 left side closest
# 4 left side second
# 5 left side far-down
# 6 top-left closer
# 7 top-left farther
# 8 top middle small
# 9 wheel right
# 10 wheel left

`

  profiles.forEach(profile => {
    if (profile.isDefault) {
      content += `g502defaultProfile=(\n`

      Object.values(profile.bindings).forEach(binding => {
        content += `  "${binding}"\n`
      })

      content += `)

function mpr-resetDefault {
  getMyMouseName
  for i in \${!g502defaultProfile[@]};
  do
    echo "ratbagctl $g502mouseName profile 0 button $i action set \${g502defaultProfile[$i]}"
  done
  echo "Default profile buttons configured"
}\n`
    } else {
      content += `
g502Profile${profile.shortName}=(
`
      Object.values(profile.bindings).forEach(binding => {
        content += `  "${binding}"\n`
      })

      content += `)

function mpr-configureAndSet${profile.shortName} {
  getMyMouseName
  for i in \${!g502Profile${profile.shortName}[@]};
  do
    ratbagctl $g502mouseName profile 1 button $i action set \${g502Profile${profile.shortName}[$i]}
  done
  echo "Profile 1 buttons configured"
  echo "${profile.name}" > $HOME/.g502gameprofile
  mpr-set 1
}
`
    }
  })

  return content
}
