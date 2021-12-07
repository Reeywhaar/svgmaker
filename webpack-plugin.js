const { sources, Compilation } = require("webpack");
const path = require("path");

/**
 * Basic usage:
 * ```
 * new SVGMakerPlugin({
 *   file: "somefile.svg.js",
 *   output: "./icons", // optional, default ""
 *   filename: "somefile.svg" // optional, default is filename without .js
 * })
 */
class SVGMakerPlugin {
  pluginName = "SVGMakerPlugin";

  constructor({ file, output, filename }) {
    this.file = file;
    this.output = output || "";
    this.filename = filename;
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: this.pluginName,
          // See lib/Compilation.js in webpack for more
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const filepath = path.resolve(compiler.context, this.file);
          const file = require(filepath);
          const string = file.toString() + "\n";
          const out = path.join(
            this.output,
            this.filename || path.parse(filepath).name
          );
          return compilation.emitAsset(
            out,
            new sources.RawSource(string, true)
          );
        }
      );
    });
  }
}

module.exports = SVGMakerPlugin;
