// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

enum PackageType {
  REACT = 'REACT',
  MODULES = 'MODULES',
  PATH_MODULES = 'PATH_MODULES',
  PATH_IMPORTS = 'PATH_IMPORTS',
}
type tDestructuredModule = {
  name: string;
  cleanedName: string;
};
type tTransformedImport = {
  packageType: PackageType;
  defaultModule: string;
  packagePath: string;
  modules: tDestructuredModule[];
  cleanedDefaultModule: string;
  cleanedPackagePath: string;
  mappedString?: string;
  hasMultilineImports: boolean;
};
enum eSortByConfiguration {
  SMALLER = '+size',
  LARGER = '-size',
  ASCENDING = 'a-z',
  DESCENDING = 'z-a',
}
const transformImportToObject = (importString: string): tTransformedImport => {
  const cleanedString = importString
    .trim() // Assume starting line is import React, { useState, useEffect } from "react";
    .replace(/^(\s+)?import(\s+)?/g, '') // Replace "import " with "" => React, { useState, useEffect } from "react";
    .replace(/(\s+)?from(\s+)?/g, '|') // Replace " from  " with "|" => React, { useState, useEffect }|"react";
    .replace(
      /^\w+,?(\s+)?/g,
      (match) => (match.match(/^\w+/g)?.[0] || '') + '|',
    ); // Replace default import "React, " with "React|" => React|{ useState, useEffect }|"react";

  const importArray = cleanedString
    .split('|')
    .filter((value) => !!value.trim());

  const packagePath = importArray.pop() || '';
  const cleanedPackagePath = packagePath.replace(/['";]/g, '');
  const packageType =
    cleanedPackagePath === 'react'
      ? PackageType.REACT
      : cleanedPackagePath.startsWith('.')
      ? PackageType.PATH_IMPORTS
      : cleanedPackagePath.includes('/')
      ? PackageType.PATH_MODULES
      : PackageType.MODULES;

  let modules: tDestructuredModule[] = [];
  let defaultModule = '';
  let cleanedDefaultModule = '';
  let hasMultilineImports = false;
  for (let modulesString of importArray) {
    modulesString ??= '';
    if (modulesString.startsWith('{')) {
      const newModules = modulesString
        .split(/{\s*|,(\s+)?}?(?!\s*as\s*)|\s*}/gm)
        .filter((value) => !!(value || '').trim())
        .map((value) => ({
          name: value,
          cleanedName: value.replace(/.+as\s+/g, ''),
        }));
      hasMultilineImports = modulesString.includes('\n');
      modules = modules.concat(newModules);
    } else {
      defaultModule = modulesString;
      cleanedDefaultModule = modulesString.trim().replace(/.+as\s+/g, '');
    }
  }

  return {
    packageType,
    defaultModule,
    modules,
    packagePath,
    cleanedDefaultModule,
    cleanedPackagePath,
    hasMultilineImports,
  };
};

const reconstructImportString = (importObject: tTransformedImport) => {
  const { defaultModule, modules, packagePath, cleanedDefaultModule } =
    importObject;
  importObject.mappedString = `import ${
    cleanedDefaultModule ? `${defaultModule}${modules.length ? ',' : ''} ` : ''
  }${
    modules.length ? `{${modules.map((value) => value.name).join(', ')}} ` : ''
  }from ${packagePath}`;
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "react-import-sorter" is now active for events!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'react-import-sorter.sortReactImports',
    () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      // Check if any text is selected
      if (!editor || editor.selection.isEmpty) {
        vscode.window.showErrorMessage('No text selected!');
        return;
      }

      // Text is selected, do something with it
      const selectedText = editor.selections
        .map((selection) => editor.document.getText(selection))
        .join('\n');
      console.log('😊 -> activate -> selectedText:', selectedText);

      // Matches following pattern
      // import "package"
      // import * as xyz from "package"
      // import default from "package"
      // import default, {module} from "package"
      // import {module} from "package"
      // import {
      // 	multilineModule1,
      // 	multilineModule2
      // } from "package"
      const matchedImports =
        selectedText.match(
          /^import\s+((.+)?(\w+)?(,)?(\s+)?({(\w|\d|\s|,)*?})?)(\s+)?(from)?(\s+)?(['"].*['"];?)/gm,
        ) || [];
      const hasImportText = !!matchedImports.length;
      console.log('😊 -> activate -> hasImportText:', hasImportText);
      console.log('😊 -> activate -> matchedImports:', matchedImports);

      if (!hasImportText) {
        vscode.window.showErrorMessage(
          "Selected text doesn't seem to contain any imports! If this seems to be a mistake, please raise an issue or contact us.",
        );
        return;
      }

      const config = vscode.workspace.getConfiguration();
      const sortOrders: string[] =
        config.get('reactImportSorter.sortingOrder') || [];
      const separateImportTypes = config.get(
        'reactImportSorter.separateByImportTypes',
      );
      const separateMultilineImports = config.get(
        'reactImportSorter.separateMultilineImports',
      );
      const sortBy = config.get('reactImportSorter.sortBy');
      const sortDestructuredModules = config.get(
        'reactImportSorter.sortDestructuredModules',
      );
      const sortDestructuredModulesBy = config.get(
        'reactImportSorter.sortDestructuredModulesBy',
      );

      // Transform import strings to custom object so we can apply transformations later on!

      const transformedImports = matchedImports.map((importString) =>
        transformImportToObject(importString),
      );
      console.log('😊 -> activate -> transformedImports:', transformedImports);

      const packageTypePriorities: Record<string, number> = {};
      let priorityCount = 1;
      for (const sortOrder of sortOrders) {
        packageTypePriorities[sortOrder] = priorityCount;
        priorityCount++;
      }
      for (const sortOrder of Object.values(PackageType)) {
        packageTypePriorities[sortOrder] ??= priorityCount;
        priorityCount++;
      }
      console.log(
        '😊 -> activate -> packageTypePriorities:',
        packageTypePriorities,
      );

      const sorted = transformedImports.sort(
        (a, b) =>
          packageTypePriorities[a.packageType] -
          packageTypePriorities[b.packageType],
      );
      console.log('😊 -> activate -> sorted:', sorted);

      const packageTypeWiseImports: Record<string, tTransformedImport[]> = {};
      for (const transformedImport of transformedImports) {
        const { packageType } = transformedImport;
        packageTypeWiseImports[packageType] ??= [];
        if (sortDestructuredModules) {
          switch (sortDestructuredModulesBy) {
            case eSortByConfiguration.ASCENDING:
              transformedImport.modules = transformedImport.modules.sort(
                (a, b) => a.cleanedName.localeCompare(b.cleanedName),
              );
              break;

            case eSortByConfiguration.DESCENDING:
              transformedImport.modules = transformedImport.modules.sort(
                (a, b) => b.cleanedName.localeCompare(a.cleanedName),
              );
              break;

            case eSortByConfiguration.SMALLER:
              transformedImport.modules = transformedImport.modules.sort(
                (a, b) => a.name.length - b.name.length,
              );
              break;

            case eSortByConfiguration.LARGER:
              transformedImport.modules = transformedImport.modules.sort(
                (a, b) => b.name.length - a.name.length,
              );
              break;

            default:
              break;
          }
        }
        packageTypeWiseImports[packageType].push(transformedImport);
      }
      console.log(
        '😊 -> activate -> packageTypeWiseImports:',
        packageTypeWiseImports,
      );

      for (const packageType of Object.keys(packageTypeWiseImports)) {
        switch (sortBy) {
          case eSortByConfiguration.ASCENDING:
            packageTypeWiseImports[packageType] = packageTypeWiseImports[
              packageType
            ].sort((a, b) =>
              a.cleanedPackagePath.localeCompare(b.cleanedPackagePath),
            );
            break;

          case eSortByConfiguration.DESCENDING:
            packageTypeWiseImports[packageType] = packageTypeWiseImports[
              packageType
            ].sort((a, b) =>
              b.cleanedPackagePath.localeCompare(a.cleanedPackagePath),
            );
            break;

          default:
            break;
        }

        for (const importObject of packageTypeWiseImports[packageType]) {
          reconstructImportString(importObject);
        }
      }

      console.log('😊 -> activate -> sortBy:', sortBy);
      for (const packageType of Object.keys(packageTypeWiseImports)) {
        switch (sortBy) {
          case eSortByConfiguration.SMALLER:
            packageTypeWiseImports[packageType] = packageTypeWiseImports[
              packageType
            ].sort(
              (a, b) =>
                (a.mappedString || '').length - (b.mappedString || '').length,
            );
            break;

          case eSortByConfiguration.SMALLER:
            packageTypeWiseImports[packageType] = packageTypeWiseImports[
              packageType
            ].sort(
              (a, b) =>
                (b.mappedString || '').length - (a.mappedString || '').length,
            );
            break;

          default:
            break;
        }
      }

      const replacementText = Object.values(packageTypeWiseImports)
        .filter((value) => value.length)
        .map((packageTypeValue) =>
          packageTypeValue
            .map(
              (value) =>
                `${
                  separateMultilineImports && value.hasMultilineImports
                    ? '\n'
                    : ''
                }${value.mappedString}`,
            )
            .join('\n'),
        )
        .join(separateImportTypes ? '\n\n' : '\n');

      // Replace the selected text with a custom value from a variable
      editor.edit((builder) => {
        builder.replace(editor.selection, replacementText);
      });
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
