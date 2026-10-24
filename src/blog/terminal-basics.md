---
title: Terminal Basics
pubDate: 2024-11-04
description:
  "A beginner-friendly guide to the command line. What shells, terminals, and
  commands are, plus essential operations for navigating and managing files."
tags: ["tools"]
---

The examples target Bash on GNU/Linux unless stated otherwise. macOS uses BSD
versions of several utilities, and flags can differ. Replace angle-bracketed
placeholders before running commands; quote paths containing spaces.

## What is a command?

A command is a program that you can run from the terminal, it is also a utility
of the shell, a shell function, or an alias. A command can receive arguments and
options.

## What is a shell?

A shell is a command line interpreter, it is a program that reads commands from
the keyboard and executes them.

- Bourne shell (sh)
- Bash shell (bash)
- C shell (csh)
- Korn shell (ksh)
- Z shell (zsh)
- Fish shell (fish)
- PowerShell (powershell)

## What is a terminal?

A terminal emulator provides a text interface to a shell or another program. It
often runs inside a graphical desktop window; the shell is the command
interpreter running within it.

## Commands

### ls

- `ls -al` : list files in long format, including hidden files
- `ls -lrt` : list files in long format, sorted by modification time, oldest
  first
- `ls -lh` : list files in long format, with human readable sizes

### tree : list files in a tree format

- `tree -L 2` : list files in a tree format, 2 levels deep.

### cd [path]

- `cd` : move to home directory
- `cd -`: change directory to previous directory
- `cd ..` : change directory to parent directory
- `cd /` : change directory to root directory
- `cd <path>`: change directory to the specified path
- `cd ~<user>`: change directory to user's home directory
- `cd ~`: change directory to current user's home directory

### **pwd** (print working directory)

- `pwd`

## managing files

### touch

- `touch file_name`: create an empty file if absent; otherwise update its
  timestamps.
- `touch file_1_name file_2_name` : create file1 and file2
- `> file_name` : create an empty file or truncate an existing file to zero
  bytes

### cp

- `cp file_name file_name_copy`: copy file_name to file_name_copy.
- `cp -r dir_name dir_name_copy`: copy dir_name to dir_name_copy.
- `cp -p` : copy files preserving attributes
- `cp -a` : copy files preserving attributes and links
- `cp -i` : prompt before overwriting existing files
- `cp -f` : force overwrite existing files

### mv

- `mv <file_name> <path>` : move file to specified path
- `mv <file1> <file2>` : rename file1 to file2
- `mv -i` : prompt before overwriting existing files
- `mv -f` : force overwrite existing files
- `mv <dir1> <path>`: move dir1 to specified path
- To include hidden entries in Bash, use `dotglob` and `nullglob`, then pass the
  expanded array to `mv`. The destination must be outside the source:

  ```bash
  (
    shopt -s dotglob nullglob
    files=(source_dir/*)
    if ((${#files[@]})); then
      mv -- "${files[@]}" destination_dir/
    fi
  )
  ```

### mkdir

- `mkdir <dir_name>`: create dir_name directory.
- `mkdir <dir1> <dir2> <dir3>` : create directories dir1, dir2, dir3
- `mkdir -p` : create parent directories as needed

### cat head tail less

- `cat <file_name>`: print file_name contents.
- `cat > <file_name>` : create file and write to it.
- `cat <file_name1> <file_name2>` : print file1 and file2 contents.
- `head <file_name>`: print the first 10 lines of file_name.
- `head -n 20 <file_name>`: print the first 20 lines of file_name.
- `tail <file_name>`: print the last 10 lines of file_name.
- `tail -n 20 <file_name>`: print the last 20 lines of file_name.
- `less <file_name>`: print file_name contents in less.
- `less +20 <file_name>`: print file_name contents in less starting at line 20.
- `less +/text <file_name>`: print file_name contents in less starting at the
  first occurrence of text.
- `less -N <file_name>`: print file_name contents in less with line numbers.
- `less -S <file_name>`: print file_name contents in less without wrapping
  lines.
- `less -F <file_name>`: exit automatically if the contents fit on one screen.
- `less -R <file_name>`: display supported color escape sequences.
- `less -X <file_name>`: skip terminal initialization/deinitialization
  sequences.
- `less -Q <file_name>`: suppress the terminal bell.
- `less -K <file_name>`: exit on an interrupt, such as Ctrl-C.
- `less -M <file_name>`: use a more detailed prompt.
- `less -i <file_name>`: case-insensitive search unless the pattern has
  uppercase letters.
- `less -I <file_name>`: always ignore case in searches.
- `less -I -N -S <file_name>`: combine case-insensitive search, line numbers and
  unwrapped lines.

### less

- `less file_name`: print file contents, one page at a time.
  - `/word_to_search_for` : allow you to search for a word in the file.
  - `q` : quit.

### file

- `file <path>` : print file type

### rm

- `rm <file_name>`: delete file_name.
- `rm -i <file>` : prompt before removing a file
- `rm -f <file>` : remove without prompting; ignore missing files
- `rm -r <dir>` : remove directories recursively
- `rmdir <dir_name>`: remove an empty directory.
- `rm -rf <dir_name>`: delete dir_name and its contents.

### xdg-open / open

- `xdg-open file_name`: open with the default desktop application on Linux.
- `open file_name`: use the default application on macOS.

### nautilus

- `nautilus [path_to_folder]` : open file manager

### type

- `type command`: print command type

### alias

- `alias`: list aliases
- `alias foo="bar"`: create alias foo for bar

### help

In Bash, `help` is a built-in that documents Bash built-ins; it does not provide
the manual for arbitrary external programs.

- `help command`: print command help

### man

user manual for commands

- `man command`: print command manual

### info

- `info command`: print command info

### whatis

- `whatis command`: print command description

### wildcards

Allows us to match patterns in filenames.

- `*`: matches any number of characters.
- `ls *.txt`: matches any file with .txt extension.
- `ls data*.txt`: list files with .txt extension starting with data.
- `?`: matches any single character.
- `??`: matches any two characters and so on.
- `ls data?.txt`: list files with .txt extension starting with data and a single
  character.
- `[abc]`: matches a, b, or c.
- `[!abc]`: matches anything but a, b, or c.
- `ls [[:upper:]]*`: list matching uppercase-leading names; for matching
  directories, `ls` lists their contents unless `-d` is used.
- `ls -d [[:upper:]]*/`: list matching directories starting with an uppercase
  letter.
- `ls -d [[:lower:]]*/`: list matching directories starting with a lowercase
  letter.
- `ls [ad]*`: list files starting with a or d followed by any number of
  characters.
- `ls -l [2-9]*`: list files starting with a number between 2 and 9.
- `ls -l [0-9][0-9]*`: list files starting with two numbers.

### redirection

A redirection is a way to redirect the output of a command to a file or another
command. file descriptor (0-1-2).

- _standard input (stdin)_ : 0
- _standard output (stdout)_ : 1
- _standard error (stderr)_ : 2
- `command < file_name`: read from file.
- `command > file_name`: write stdout of the specified command to file.
- `command >> file.txt` : append stdout to file.
- `ls 2> file_name`: write stderr to file.
- `ls 2>> file_name`: append standard error to file.
- `ls > file_name 2>&1`: write standard output and standard error to file.

### pipes

A pipe is a way to connect the output of one command to the input of another
command.

- `echo "foo" | grep "foo"`: print "foo" and grep for "foo".
- `cat file1 file2 | grep "foo"`: print file1 and file2 and grep for "foo".
- `ls -lh | tee file_name | less`: list files in long format with human readable
  sizes, write to file, and print one page at a time.
- `ls -lh folder | sort | tee file_name | less`: list files in long format with
  human readable sizes, sort, write to file, and print one page at a time.
- `cowsay "foo" | lolcat`: print "foo" with cowsay and lolcat.
- `echo "foo" | cowsay | lolcat`: print "foo" with cowsay and lolcat.

### control operators

Control operators determine sequencing and conditions. `;`, `&&`, and `||` do
not by themselves create subshells; `&` starts an asynchronous job in Bash.

- `ls; echo "foo"`: list files and print "foo".
- `ls; mkdir dir; cal`: list files, create directory, and print calendar.
  (asynchronous "&" creates a background process).
- `ls & echo "foo"`: run `ls` in the background and `echo` in the foreground.
- `ls && echo "foo"`: list files and print "foo" if ls succeeds.
- `ls || echo "foo"`: list files and print "foo" if ls fails.

### permissions

A permission is a way to control access to a file or directory.

`ls -l` begins with a type character: `-` for a regular file, `d` for a
directory, `l` for a symbolic link, and `b` for a block device. A block device
is a device that is accessed in fixed-size blocks.

### Kind of permissions

- r : read
- w : write
- x : execute

| owner | group | other |
| ----- | ----- | ----- |
| rwx   | r-x   | r-x   |
| 111   | 101   | 101   |
| 7     | 5     | 5     |

### Symbolic mode

u : user g : group o : other a : all chmod u=rwx,g=rwx,o=rwx file : set
permissions to 777

- root user: a root user has full access to the system.
- `chmod` : change file permissions (change mode)(octal).
- `chmod 755 file_name`: set permissions to 755. (owner: rwx, group: rx, other:
  rx).
- `chmod u=rwx,g=rwx,o=rwx file_name`: set permissions to 777. (owner: rwx,
  group: rwx, other: rwx).
- `chmod u-rwx,g-rwx,o-rwx file_name`: set permissions to 000. (owner: ---,
  group: ---, other: ---).
- `chmod g+w file_name`: add group write permission, preserving all other bits.
- `whoami`: print current user.
- `id`: print current user and group.
- `su root`: switch to root user.
- `su user`: switch to user.
- in ubuntu: `sudo su` :switch to root user.
- `passwd`: change password.
- `chown -R "$(id -un):$(id -gn)" folder_name`: recursively set owner and
  primary group to the current user; sufficient privileges are required.

### change password

passwd : change password

### managing permissions

- `chmod u=rwx,g=rwx,o=rwx file_name`: set permissions to 777
- `chmod u=rwx,g=rwx,o=rx file_name`: set permissions to 775
- `chmod u=rwx,g=rwx,o= file_name`: set permissions to 770
- `chmod u=rwx,g=rwx file_name`: set user and group to rwx; leave other bits
  unchanged
- `chmod u=rwx,go=w file_name`: set ordinary permission bits to 722
- `chmod 777 file_name`: change file_name permissions to 777.
- `chmod 755 file_name`: change file_name permissions to 755.
- `chmod 644 file_name`: change file_name permissions to 644.
- `chmod 600 file_name`: change file_name permissions to 600.
- `chmod 400 file_name`: change file_name permissions to 400.
- `chmod 000 file_name`: change file_name permissions to 000.
- `chmod u+x file_name`: add execute permission to file_name for user.
- `chmod u-x file_name`: remove execute permission to file_name for user.
- `chmod u+r file_name`: add read permission to file_name for user.
- `chmod u-r file_name`: remove read permission to file_name for user.
- `chmod u+w file_name`: add write permission to file_name for user.
- `chmod u-w file_name`: remove write permission to file_name for user.
- `chmod u+x,g+x,o+x file_name`: add execute permission to file_name for user,
  group and others.
- `chmod u-x,g-x,o-x file_name`: remove execute permission to file_name for
  user, group and others.
- `chmod u+r,g+r,o+r file_name`: add read permission to file_name for user,
  group and others.
- `chmod u-r,g-r,o-r file_name`: remove read permission to file_name for user,
  group and others.
- `chmod u+w,g+w,o+w file_name`: add write permission to file_name for user,
  group and others.
- `chmod u-w,g-w,o-w file_name`: remove write permission to file_name for user,
  group and others.
- `chmod u+x,g+x,o+x,u-r,g-r,o-r,u-w,g-w,o-w file_name`: add execute permission
  to file_name for user, group and others and remove read and write permission
  to file_name for user, group and others.

### environment variables

Environment variables are name/value pairs inherited by child processes. In
Bash, assignment creates a shell variable; `export` makes it part of the
environment passed to subsequent commands.

- `ln -s /home/user/dir link_name`: create symbolic link to dir named link_name.
- `printenv`: print environment variables
- `echo $VARIABLE_NAME`: print VARIABLE_NAME environment variable
- `echo $PATH`: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:
  /sbin:/bin:/usr/games:/usr/local/games:/snap/bin --> _the directories where
  the shell looks for commands_
- `echo $HOME`: print HOME environment variable -- /home/user -- the home
  directory of the current user
- `echo $USER` : print USER environment variable -- user -- the current user
- `echo $SHELL` : print SHELL environment variable -- /bin/bash -- the shell
  program

### how to modify environment variables?

export PATH=$PATH:/home/user/bin : add /home/user/bin to PATH environment
variable

- look for the file `.bashrc` (bash) in the home directory of the user.
- open the file `.bashrc` with a text editor to who is using bash. In mac
  `.zshrc`. That's could vary depending on the shell you are using.
- add the line export PATH=$PATH:/home/user/bin to the file .bashrc.
- to add a environment variable, add the line `export VARIABLE_NAME='value'` to
  the file .bashrc.
- to add an alias, add the line `alias alias_name='command'` to the file
  .bashrc.
- to add bins to the path, add the line `export PATH=$PATH:/home/user/bin` to
  the file .bashrc.
- save the file .bashrc.

### Searching command

A search command is a way to search for a command.

- `which <command>` : print command path. If the command is not found, nothing
  is printed.
- `which code`: /usr/bin/code --> _the path to the command code_
- `find path -name "file_name"`: search for file_name in path. **segment by name
  (wildcards and find):**
- `find path -name "*.txt"`: search for files with .txt extension in current
  directory. **segment by type:**
- `find path -type f -name "*.txt"` : search for files with .txt extension in
  the specified path.
- `find ./ -type f -name "*.log"`: search for files with .log extension in
  current directory.
- `find ./ -type d -name dir`: search for directories with name dir in current
  directory.
- `find ./ -type d -empty`: search for empty directories in current directory.
- `find ./ -maxdepth 2 -type d`: search for directories in current directory
  with a maximum depth of 2
- `find ./ -mindepth 2 -type d`: search for directories in current directory
  with a minimum depth of 2 **segment by size:**
- `find ./ -type f -size +100k`: search for files in current directory with a
  size greater than 100k.
- `find ./ -size +100M`: search for files larger than 100M in current directory.
- `find ./ | less`: search for files in current directory and print the results
  in less. **segment by date:**
- `find ./ -type f -mtime +1`: search for files in current directory that were
  modified at least two full 24-hour periods ago (`-mtime` rounds down).
  **segment by permission:**
- `find ./ -type f -perm 777`: search for files in current directory with
  permissions 777.
- `find ./ -type f -perm -777`: search for files in current directory with all
  of the listed permission bits set (additional special bits may be set).
- `find ./ -type f -perm /777`: search for files in current directory with at
  least one listed permission bit set (GNU find syntax). **segment by owner:**
- `find ./ -type f -user user`: search for files in current directory with owner
  user.
- `find ./ -type f -group group`: search for files in current directory with
  group group. **segment by content:**
- `find ./ -type f -exec grep -l 'text' {} \;`: search for files in current
  directory with the text text and print the file name.
- `find ./ -type f -exec grep -q 'text' {} \; -ok rm {} \;`: find matching files
  and ask before deleting each; this preserves filenames containing spaces.
- `find ./ -type f -size +100k -exec rm {} \;`: search for files in current
  directory with a size greater than 100k and delete them.

### **managing directories**

A directory is a way to manage directories.

- `pwd`: print working directory.
- `cd dir_name`: change directory to dir_name.
- `cd ..`: change directory to parent directory.
- `cd ~`: change directory to home directory.
- `cd -`: change directory to previous directory.
- `ls`: list directory contents.
- `ls -a`: list directory contents including hidden files.
- `ls -l`: list directory contents in long format.
- `ls -la`: list directory contents in long format including hidden files.
- `ls -lh`: list directory contents in long format with human readable sizes.
- `ls -lah`: list directory contents in long format with human readable sizes
  including hidden files.
- `ls -lt`: list directory contents in long format sorted by modification time.
- `ls -lat`: list directory contents in long format sorted by modification time
  including hidden files.
- `ls -lS`: list directory contents in long format sorted by size.
- `ls -lSr`: list directory contents in long format sorted by size in reverse.
- `ls -lX`: list directory contents in long format sorted by extension.
- `ls -lXr`: list directory contents in long format sorted by extension in
  reverse.
- GNU `ls -lU`: use directory order, without sorting. On macOS, `-U` has
  different timestamp semantics; check the local `man ls`.
- `ls -lF`: list directory contents in long format with a slash after
  directories.

### whereis

`whereis` locates binaries, manual pages and source locations for command names;
it is not a general file search.

- `whereis <file_name>`: find file_name.
- `whereis -b <file_name>`: find file_name binaries.
- `whereis -m <file_name>`: find file_name manuals.
- `whereis -s <file_name>`: find file_name sources.

## ln

ln -s : create symbolic links

## find

Quote patterns so `find`, rather than the shell, interprets them:

```bash
find . -type f -name '*.txt'
find . -type f -name '*.txt' -exec grep -n 'foo' {} +
```

The first command finds text files recursively. The second searches their
contents and safely handles filenames containing spaces. Permission predicates
are bit tests, not numeric comparisons; see the
[GNU find mode-bit reference](https://www.gnu.org/software/findutils/manual/html_node/find_html/Mode-Bits.html).

### grep

A grep is a way to search for a pattern in a file.

- `grep <regex> <file_name>`: search for regex in file_name.
- `grep -r <regex> <file_name>`: search for regex in file_name recursively.
- `grep -i <regex> <file_name>`: search for "foo" in files, case insensitive.
- `grep -v <regex> <file_name>` : invert match, print non-matching lines.
- `grep -l <regex> <file_name>`: print names of files with at least one matching
  line
- `grep -c <regex> <file_name>`: count matching lines, not individual
  occurrences.
- `grep -n <regex> <file_name>`: print line numbers.
- `grep -A 2 <regex> <file_name>`: search for regex in files, print 2 lines
  after match
- `grep -B 2 <regex> <file_name>`: search for regex in files, print 2 lines
  before match
- `grep -C 2 <regex> <file_name>`: search for regex in files, print 2 lines
  before and after match
- `wc <file_name>`: count newline characters, words and bytes.
- `wc -l <file_name>`: count lines in file_name.
- `wc -w <file_name>`: count words in file_name.
- `wc -c <file_name>`: count bytes. Use `wc -m` to count characters.

## Network utilities

These commands inspect interfaces or communicate with network services.

- `ifconfig`: print network interfaces.
- `ping <host-or-ip>`: send ICMP echo requests; a missing reply can reflect
  filtering
- `curl <url>`: print url contents.
- `curl <url> > index.html`: write url contents (stdout) to index.html.
- `wget <url>`: download url. get form url.
- `traceroute <host-or-ip>`: probe hops toward a destination; some may not
  reply.
- `netstat -tulpn`: print listening ports.
- `netstat -i`: print networks interfaces.

## compression

A compression is a way to compress files.

- `gzip <file_name>`: compress a regular file; use tar with gzip for a directory
  tree.
- `tar -cvf <file_name.tar> <file_name/dir>`: create tar file.
- `tar -cvzf <file_name.tar.gz> <file_name/dir>`: create tar.gz file (gzip).
- `tar -xvzf <file_name.tar.gz>`: extract tar file.
- `zip -r <file_name.zip> <file/dir>`: create zip file.
- `unzip <file_name.zip>` : extract zip file.

## Process management

A process is a running instance of a program.

- `ps`: show processes associated with the current terminal by default.
- `ps -ef`: show a broader process listing on common Unix systems.
- `kill <pid>`: send SIGTERM, requesting termination; it is not guaranteed to
  stop the process.
- `top`: inspect processes interactively; keys vary by platform. Read its help
  or `man top`.
- `htop`: an optional interactive terminal process viewer.

## Background jobs

Bash job control manages commands started in the current interactive shell:

- `sleep 1000 &`: start a background job.
- `jobs`: list this shell's jobs.
- Ctrl-Z: suspend the foreground job, rather than terminate it.
- `bg %1`: continue job 1 in the background.
- `fg %1`: continue job 1 in the foreground.
- `kill %1`: send SIGTERM to job 1.
- `kill %%`: signal the current job, not all background jobs.

A background command that tries to read from the terminal normally stops with
SIGTTIN. Use input from a file or run it in the foreground instead.

## vim

- `vim <file_name>`: open file_name.
  - `i`: insert mode.
  - `esc`: normal mode.
  - `:w`: write file.
  - `:q`: quit file.
  - `:wq`: write and quit file.
  - `:q!`: quit without saving.
  - `:w!`: write over file.
  - `:wq!`: write over file and quit.
  - `:w <file_name>`: write to file_name.
  - `/regex`: search for regex.
  - `dd`: delete line.
  - `yy`: copy line.
  - `p`: paste line.
  - `u`: undo.
  - `ctrl + r`: redo.
  - `gg`: go to first line.
  - `G`: go to last line.
  - `n`: next match.
  - `N`: previous match.
  - `:%s/foo/bar/g`: replace every match of foo with bar throughout the buffer.
- `vim -R <file_name>`: open file_name in read-only mode.
- `vim -O file1 file2`: open files in vertical splits.
- `vim -o <file_name>`: open file_name in horizontal split mode.
- `vim -p <file_name>`: open file_name in tab mode.
- `vim -c <command>`: execute command.
- `vim -c "set number" <file_name>`: open file_name with line numbers.
- `vim -c "set number" -c "set hlsearch" <file_name>`: open file_name with line
  numbers and highlight search.

## customize the terminal

- [bash](https://ohmybash.nntoan.com)
- [zsh](https://ohmyz.sh)

## References

- [Platzi: Curso de Introducción a la Terminal y Línea de Comandos](https://platzi.com/cursos/terminal/)
