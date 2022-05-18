# MPR

MPR stands for "Mouse Profiler". This tiny app creates bash script files to configure, set up and switch between different game profiles for a Logitech G502 gaming mouse using short commands or desktop entries.

The profiles are parsed from a JSON config file from the home folder and at the end those are loaded onto the mouse using the [libratbag](https://github.com/libratbag/libratbag) package.

MPR has been tested on Fedora, most probably works on Ubuntu and its derivatives. `libratbag` must be installed, and the desktop entries are working on the Gnome desktop environment.

## Setting up

- Have `npm` and `node` installed (created and tested on Node v. 16, wasn't tested on lower versions)
- Run `npm ci` in the project folder
- Create your config file `~/.mprconfig.json` in your home folder according to the `.mprconfig.example.json` file
- Run `npm start`

Alternatively (after install and set up) you can create an alias as well: 
```shell
alias mpr-generate='node ~/path/to/mpr/dist/index.js'
```

This will generate the shell script files in the `~/.mpr` folder, and the desktop entries in the `.local/share/applications` folder.

Don't forget to log out / log in so Gnome can pick up the changes.

## Using the profiles

There must be a default, so-called 'everyday' profile, which will be configured to #0 on the mouse. This will not be changed later.

For profile #1 on the mouse, we can have the different game profiles.

All the following commands are available from the terminal or from the Applications menu on Gnome.

- `mpr` tells you what is the current profile, and if it's the default (#0), which game is configured to #1
- `mpr 0` quickly switches to profile #0 (the default)
- `mpr 1` quickly switches to profile #1 (last configured game)
- `mpr <game-abbreviation>` configures the profile #1 on the mouse to the chosen game and switches to that profile

## Technologies used in this project

- Typescript
- Node.js
- Bash
- Prettier + Eslint for code quality
