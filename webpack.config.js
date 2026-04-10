const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs");

// Automatically discover all blocks in blocks/src directory
function getBlockEntries() {
  const entries = {};
  const blocksDir = path.resolve(__dirname, "blocks/src");

  if (fs.existsSync(blocksDir)) {
    const blockDirs = fs
      .readdirSync(blocksDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    blockDirs.forEach((blockName) => {
      const blockPath = path.join(blocksDir, blockName);

      // Add index.js if it exists
      if (fs.existsSync(path.join(blockPath, "index.js"))) {
        entries[`${blockName}/index`] = `./blocks/src/${blockName}/index.js`;
      }

      // Add view.js if it exists
      if (fs.existsSync(path.join(blockPath, "view.js"))) {
        entries[`${blockName}/view`] = `./blocks/src/${blockName}/view.js`;
      }
    });
  }

  return entries;
}

// Automatically discover all block files for copying (block.json and render.php)
function getBlockCopyPatterns() {
  const patterns = [];
  const blocksDir = path.resolve(__dirname, "blocks/src");

  if (fs.existsSync(blocksDir)) {
    const blockDirs = fs
      .readdirSync(blocksDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    blockDirs.forEach((blockName) => {
      // Copy block.json if it exists
      const blockJsonPath = path.join(blocksDir, blockName, "block.json");
      if (fs.existsSync(blockJsonPath)) {
        patterns.push({
          from: `blocks/src/${blockName}/block.json`,
          to: `${blockName}/block.json`,
        });
      }

      // Copy render.php if it exists
      const renderPhpPath = path.join(blocksDir, blockName, "render.php");
      if (fs.existsSync(renderPhpPath)) {
        patterns.push({
          from: `blocks/src/${blockName}/render.php`,
          to: `${blockName}/render.php`,
        });
      }
    });
  }

  return patterns;
}

module.exports = {
  ...defaultConfig,
  entry: {
    // Tailwind CSS (for both frontend and editor)
    tailwind: "./src/css/tailwind.css",
    
    // Core functionality
    core: "./core/src/index.js",

    // Main theme JavaScript
    main: "./src/js/index.js",

    // Theme styles
    styles: "./styles/index.js",

    // Automatically discovered blocks
    ...getBlockEntries(),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    ...defaultConfig.plugins,
    new CopyWebpackPlugin({
      patterns: getBlockCopyPatterns(),
    }),
  ],
};
