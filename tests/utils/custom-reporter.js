const events = require("events");
const chalk = require("chalk");
const humanizeDuration = require("humanize-duration");

const DURATION_OPTIONS = {
  units: ["m", "s"],
  round: true,
  spacer: ""
};

class CustomAcceptanceReporter extends events.EventEmitter {
  constructor(baseReporter) {
    super();
    this.consoleOutput = "";
    this.baseReporter = baseReporter;
    this.indents = {};
    this.results = {};
    this.shortEnglishHumanizer = humanizeDuration.humanizer({
      language: "shortEn",
      languages: {
        shortEn: {
          h: () => "h",
          m: () => "m",
          s: () => "s",
          ms: () => "ms"
        }
      }
    });

    this.on("runner:start", function({ cid }) {
      this.indents[cid] = 0;
      this.results[cid] = {
        passing: 0,
        pending: 0,
        failing: 0
      };
    });

    this.on("suite:start", function({ keyword, tags, title, description }) {
      if (keyword) {
        this.printSuiteType(tags, title, keyword);
        if (description) process.stdout.write("\n\n" + description + "\n\n");
        else process.stdout.write("\n\n");
      } else this.printSuiteType(tags, title, "Scenario");
    });

    this.on("test:pass", function({ cid, keyword, title }) {
      this.results[cid].passing++;
      this.consoleOutput = keyword + title;
      process.stdout.write("\n" + chalk.green("✔ " + this.consoleOutput));
    });

    this.on("test:fail", function({ cid, keyword, title }) {
      if (keyword !== "Hook") {
        this.results[cid].failing++;
        process.stdout.write("\n" + chalk.red("✖ " + keyword + title));
      } else if (
        this.consoleOutput !== "" &&
        this.consoleOutput.includes("Given")
      ) {
        this.results[cid].passing--;
        this.results[cid].failing++;
        process.stdout.write("\r\x1b[K");
        process.stdout.write(chalk.red("✖ " + this.consoleOutput));
        this.consoleOutput = "";
      }
    });

    this.on("test:pending", function({ cid, keyword, title }) {
      this.results[cid].pending++;
      process.stdout.write("\n" + chalk.yellow("- " + keyword + title));
    });

    this.on("suite:end", function({ cid }) {
      this.indents[cid]--;
      process.stdout.write("\n\n");
    });

    this.on("runner:end", function(runner) {
      process.stdout.write(this.getSuiteResult(runner) + "\n");
    });
  }

  printSuiteType(tags, name, type) {
    const tagsString = tags.map(({ name }) => name).join(" ");
    process.stdout.write(chalk.cyan(tagsString) + "\n");
    process.stdout.write(chalk.white(`${type}: ${name}`));
  }

  getColor(state) {
    const color = {
      pass: "green",
      passing: "green",
      pending: "yellow",
      fail: "red",
      failing: "red"
    };
    return color.hasOwnProperty(state) ? color[state] : null;
  }

  getSuiteResult(runner) {
    const cid = runner.cid;
    const stats = this.baseReporter.stats;
    const results = stats.runners[cid];
    const specHash = stats.getSpecHash(runner);
    const spec = results.specs[specHash];
    const failures = stats
      .getFailures()
      .filter(f => f.cid === cid || Object.keys(f.runner).indexOf(cid) > -1);

    if (Object.keys(spec.suites).length === 0) return "";

    let output = "";
    output +=
      "------------------------------------------------------------------\n";
    output += this.getSummary(this.results[cid], spec._duration);
    output += this.getFailureList(failures);
    return output;
  }

  getSummary(states, duration) {
    let output = "";
    let displayedDuration = false;
    for (const state in states) {
      const testCount = states[state];
      let testDuration = "";

      if (testCount === 0) continue;

      if (!displayedDuration) {
        testDuration =
          " (" + this.shortEnglishHumanizer(duration, DURATION_OPTIONS) + ")";
      }
      output += chalk[this.getColor(state)](testCount);
      output += " " + chalk[this.getColor(state)](state);
      output += testDuration;
      output += "\n";
      displayedDuration = true;
    }
    return output;
  }

  getFailureList(failures) {
    let output = "";
    failures.forEach((test, i) => {
      const title =
        typeof test.parent !== "undefined"
          ? test.parent + " " + test.title
          : test.title;
      output += `${i + 1}) ${title}:\n`;
      output += `${chalk.red(test.err.message)}\n`;
      if (test.err.stack) {
        const stack = test.err.stack
          .split(/\n/g)
          .map(l => `${chalk.gray(l)}`)
          .join("\n");
        output += `${stack}\n`;
      } else {
        output += `${chalk.gray("no stack available")}\n`;
      }
    });
    return output;
  }
}

CustomAcceptanceReporter.reporterName = "CustomAcceptanceReporter";

module.exports = CustomAcceptanceReporter;
