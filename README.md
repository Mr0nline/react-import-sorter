# React Import Sorter
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

React Import Sorter is a powerful and user-friendly VS Code extension that helps you keep your imports in React projects organized and easy to maintain.
![Quick Demo](https://github.com/Mr0nline/React-Import-Sorter/blob/main/react-import-sorter.gif?raw=true)

## Installation

You can install the React Import Sorter extension by searching for it in the VS Code extensions marketplace, or by downloading it from the [extension's page](https://marketplace.visualstudio.com/items?itemName=MrOnline.react-import-sorter).

## Features

- Sorts imports in React projects according to configurable settings
- Allows you to define custom import sorting orders
- Supports multiline sorting
- Supports sorting by import size or alphabetically
- Separates different types of imports with a new line
- Adds a new line before multiline imports
- Sorts destructured imports

## Configuration

React Import Sorter comes with several configuration options that allow you to customize how your imports are sorted. These options can be accessed via the VS Code settings menu under the "React Import Sorter" category.

> It's highly recommended to use formatters like Prettier to keep consistent formatting!

### Sorting Order

The `reactImportSorter.sortingOrder` option allows you to define the order in which your imports are sorted. This is an array of strings that can include the following values:

- `REACT` - Sorts all React imports first
- `MODULES` - Sorts all node module imports next
- `PATH_MODULES` - Sorts path alias imports next
- `PATH_IMPORTS` - Sorts all other path imports last

### Separation of Import Types

The `reactImportSorter.separateByImportTypes` option determines whether different types of imports are separated with a new line.

### Separation of Multiline Imports

The `reactImportSorter.separateMultilineImports` option determines whether a new line is added before multiline imports.

### Sorting of Destructured Modules

The `reactImportSorter.sortDestructuredModules` option determines whether destructured imports are sorted. For example, `{ c, a, d }` can be sorted as `{ a, c, d }`.

### Sorting By

The `reactImportSorter.sortBy` option determines the order in which your imports are sorted. This option accepts four possible values:

- `+size` - Sorts imports by size in ascending order
- `-size` - Sorts imports by size in descending order
- `a-z` - Sorts imports alphabetically in ascending order
- `z-a` - Sorts imports alphabetically in descending order

### Sorting of Destructured Modules By

The `reactImportSorter.sortDestructuredModulesBy` option determines the order in which destructured imports are sorted. This option accepts four possible values:

- `+size` - Sorts destructured imports by size in ascending order
- `-size` - Sorts destructured imports by size in descending order
- `a-z` - Sorts destructured imports alphabetically in ascending order
- `z-a` - Sorts destructured imports alphabetically in descending order

### Path Import Prefixes

The `reactImportSorter.pathImportPrefixes` option allows you to define custom path import prefixes that are used to identify path imports. By default, all imports with `/` are considered as path imports, even if they are from node_modules like `@mui/material`.

## Usage

To sort imports in a file, Select all import statements, open the file and run the "Sort React Imports" command. This can be done by pressing `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac) to open the VS Code command palette and searching for the "Sort React Imports" command.

### Configuration options

The extension comes with several configuration options that can be adjusted to fit your preferences. These options can be accessed by going to File > Preferences > Settings and searching for "React Import Sorter". Here are some of the most useful options:

- `reactImportSorter.sortingOrder`: An array of strings that defines the order of imports to sort by.
- `reactImportSorter.separateByImportTypes`: Whether to separate different types of imports with a new line.
- `reactImportSorter.separateMultilineImports`: Whether to add a new line before multiline imports.
- `reactImportSorter.sortDestructuredModules`: Whether to sort destructured imports.
- `reactImportSorter.sortBy`: The sorting order for the imports.
- `reactImportSorter.sortDestructuredModulesBy`: The sorting order for the destructured imports, only applicable when `sortDestructuredModules` is on.
- `reactImportSorter.pathImportPrefixes`: An array of strings that defines the custom made alias paths (generally via `tsconfig.json`'s `paths`). By default, all the imports with `/` will be considered as path imports, even if they're from `node_modules` like `@mui/material`.

### Contributing

Contributions to this project are always welcome. If you have any issues or feature requests, please submit them through the GitHub repository's [issue tracker](https://github.com/Mr0nline/React-Import-Sorter/issues).

To contribute to the codebase, follow these steps:

1. Fork the repository.
2. Clone your forked repository to your local machine.
3. Install the required dependencies using `npm install`.
4. Make changes to the codebase.
5. Write tests for your changes.
6. Run the tests using `npm run test`.
7. If the tests pass, commit your changes and push them to your forked repository.
8. Open a pull request to the original repository.

### License

This project is licensed under the terms of the MIT license. See the `LICENSE` file for more information.

### Contact

If you have any questions or concerns, feel free to contact the author of this extension, [MrOnline](https://github.com/Mr0nline), through the [GitHub repository](https://github.com/Mr0nline/React-Import-Sorter) or by email at mronlinesworld@gmail.com.

> Thank you for using React Import Sorter!

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Mr0nline"><img src="https://avatars.githubusercontent.com/u/57582883?v=4?s=100" width="100px;" alt="Mr.Online"/><br /><sub><b>Mr.Online</b></sub></a><br /><a href="#ideas-Mr0nline" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-Mr0nline" title="Maintenance">🚧</a> <a href="#question-Mr0nline" title="Answering Questions">💬</a> <a href="#design-Mr0nline" title="Design">🎨</a> <a href="https://github.com/Mr0nline/React-Import-Sorter/issues?q=author%3AMr0nline" title="Bug reports">🐛</a> <a href="https://github.com/Mr0nline/React-Import-Sorter/commits?author=Mr0nline" title="Code">💻</a> <a href="https://github.com/Mr0nline/React-Import-Sorter/commits?author=Mr0nline" title="Documentation">📖</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!