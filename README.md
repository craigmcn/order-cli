Order CLI
=========

![nycrc config on GitHub](https://img.shields.io/nycrc/craigmcn/order-cli)

A small command line utility to shuffle a list of names for a meeting round-table speaking order.

Provided a list of names, the list will be shuffled in a random order and copied to the clipboard.

Requirements
------------

Node >= 18

Usage
-----

```console
> npx speaking-order-cli [options] [--] <participants...>
```
**Or**

```console
> npm install -g speaking-order-cli
> order [options] [--] <participants...>
```

Commands
--------

| Command | Description |
|---|---|
| `order init [-f|--format=json|yaml]` | Create a config file (`~/.orderrc.json` or `~/.orderrc.yaml`) with the default options |
| `order set <key> [value..]` | Set a configuration value (creates the config file if it doesn't exist yet) |
| `order rm [-g|--group=index] <key> [index]` | Remove a configuration value, an item from an array value, or a whole group (`order rm groups <index>`) |
| `order show [-g|--group=index]` | Display the current configuration, or a single saved group |
| `order [options] [--] <participants...> --save` | Save the participants and options for the current run as a new group |
| `order [options] -g, --group=index` | Run using a previously saved group's participants and options |

The config file stores default options plus any saved "groups" (a saved list of participants
along with the options used to order them). The directory the CLI looks in for the config file
defaults to the user's home directory, and can be overridden with the `ORDER_CONFIG_DIR`
environment variable (mainly useful for testing or running multiple isolated configurations).

Options
-------

| Option | Description | Type |
|---|---|---|
|`--debug`             | Output debug information    | [`boolean`] |
|`-p, --prefix `       | Output prefix               | [`string`] [_default:_ "Speaking order: "] |
|`-s, --separators`    | Output list separators (i.e., [separator, lastSeparator]) | [`array`] [_default:_ [",", "then"]] |
|`--oc, --oxford-comma`| Use the Oxford comma (e.g., "Alice, Bob, and Charlie"; applies the separator to the second-to-last item) | [`boolean`] |
| `--cc, --clipboard`  | Copy the output to the clipboard (to disable: `--no-cc`, `--no-clipboard`) | [`boolean`] [_default_: true] |
| `--clr, --colors`    | Colorize the output (to disable: `--no-clr`, `--no-colors`) | [`boolean`] [_default_: true] |
|`-h, --help`          | Show help                   | [`boolean`] |
|`-v, --version `      | Show version number         | [`boolean`] |

Examples
--------

```console
> npx order Alice Bob Charlie
Speaking order: Bob, Charlie then Alice

> npx order -p "Here's the order: " Alice Bob Charlie
Here's the order: Charlie, Bob then Alice

> npx order -s ";" "and" --oc -- Alice Bob Charlie
Speaking order: Alice; Charlie; and Bob
```
