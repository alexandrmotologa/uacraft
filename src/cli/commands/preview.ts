import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { exec } from "child_process";
import chalk from "chalk";
import { CreativePackage } from "../../types";
import { exportHtmlStoryboard } from "../../core/exporters/html-preview";

export interface PreviewCommandOptions {
  input: string;
  port?: string;
  noOpen?: boolean;
}

function openBrowser(url: string): void {
  const startCmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
      ? `open "${url}"`
      : `xdg-open "${url}"`;

  exec(startCmd, (err) => {
    if (err) {
      console.log(chalk.gray(`Could not open browser automatically. Please open: ${url}`));
    }
  });
}

export async function previewCommand(options: PreviewCommandOptions): Promise<void> {
  const inputPath = path.resolve(process.cwd(), options.input);

  if (!fs.existsSync(inputPath)) {
    console.error(chalk.red(`Error: File not found at ${inputPath}`));
    process.exit(1);
  }

  let htmlContent = "";

  if (inputPath.endsWith(".html")) {
    htmlContent = fs.readFileSync(inputPath, "utf8");
  } else if (inputPath.endsWith(".json")) {
    let pkg: CreativePackage;
    try {
      pkg = JSON.parse(fs.readFileSync(inputPath, "utf8"));
      htmlContent = exportHtmlStoryboard(pkg);
    } catch (err: any) {
      console.error(chalk.red(`Error reading package: ${err.message}`));
      process.exit(1);
    }
  } else {
    console.error(chalk.red("Error: Expected a .json creative package or .html storyboard file."));
    process.exit(1);
  }

  const port = options.port ? parseInt(options.port, 10) : 3456;

  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(htmlContent);
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(chalk.bold.cyan(`\n=== UACraft Interactive Storyboard Server ===`));
    console.log(chalk.green(`✓ Serving storyboard at: ${chalk.underline.bold(url)}`));
    console.log(chalk.gray(`Press Ctrl+C to stop server.\n`));

    if (!options.noOpen) {
      openBrowser(url);
    }
  });
}
