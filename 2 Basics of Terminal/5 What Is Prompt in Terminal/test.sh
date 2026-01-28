# a prompt in terminal is a message or command that a computer system displays to indicate that it's ready to receive input or execute command

# Change Prompt message string 1 temporarily
$PS1="Hello"

# Change Prompt message string 2 temporarily
$PS2="World"

# To change permanatly you can create .bashrc file and set there with same commands.

# source bashrc file to refresh terminal on change
source ~/.bashrc

# make alias
alias source="source ~/.bashrc" # To make alias available you need to run "source ~/.bashrc" in terminal once. Once you done that you can directly run source to execute "source ~/.bashrc"