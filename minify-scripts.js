const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const directoryPath = path.join(__dirname, "lib");

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }
  files.forEach((file) => {
    if (file.endsWith(".js") && !file.endsWith(".min.js")) {
      const inputFilePath = path.join(directoryPath, file);
      const outputFilePath = path.join(
        directoryPath,
        `${path.parse(file).name}.min.js`
      );
      const command = `npx terser "${inputFilePath}" --output "${outputFilePath}" --compress --mangle`;
      try {
        execSync(command);
        fs.unlinkSync(inputFilePath);
      } catch (error) {
        console.error(`Error minifying ${file}:`, error);
      }
    }
  });
});
