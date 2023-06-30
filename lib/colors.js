/*
# ANSI Color Options
| Color         | Name           | Foreground | Background | COLOR equivalent |
| ------------- | -------------- | ---------- | ---------- | ---------------- |
| Default       |                | 0m         |            |                  |
| Black         | BLACK          | 30m        | 40m        | 0                |
| Red           | DARK_RED       | 31m        | 41m        | 4                |
| Green         | DARK_GREEN     | 32m        | 42m        | 2                |
| Yellow        | DARK_YELLOW    | 33m        | 43m        | 6                |
| Blue          | DARK_BLUE      | 34m        | 44m        | 1                |
| Magenta       | DARK_MAGENTA   | 35m        | 45m        | 5                |
| Cyan          | DARK_CYAN      | 36m        | 46m        | 3                |
| Light gray    | DARK_WHITE     | 37m        | 47m        | 7                |
| Dark gray     | BRIGHT_BLACK   | 90m        | 100m       | 8                |
| Light red     | BRIGHT_RED     | 91m        | 101m       | C                |
| Light green   | BRIGHT_GREEN   | 92m        | 102m       | A                |
| Light yellow  | BRIGHT_YELLOW  | 93m        | 103m       | E                |
| Light blue    | BRIGHT_BLUE    | 94m        | 104m       | 9                |
| Light magenta | BRIGHT_MAGENTA | 95m        | 105m       | D                |
| Light cyan    | BRIGHT_CYAN    | 96m        | 106m       | B                |
| White         | WHITE          | 97m        | 107m       | F                |
| Bold          |                | 1m         |            |                  |
| Underline     |                | 4m         |            |                  |
| No underline  |                | 24m        |            |                  |
| Reverse text  |                | 7m         |            |                  |
| Positive text (not reversed) | | 27m        |            |                  |
*/

function green(str) { // BRIGHT_GREEN
  return '\u001b[92m' + str + '\u001b[0m';
}

function red(str) { // BRIGHT_RED
  return '\u001b[91m' + str + '\u001b[0m';
}

function white(str) { // WHITE
  return '\u001b[97m' + str + '\u001b[0m';
}

const colors = {
  green,
  red,
  white
};

export { colors as default, green, red, white };