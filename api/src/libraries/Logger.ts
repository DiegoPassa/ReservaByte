import chalk from "chalk";

export default class Logging {
    public static log = (args: any) => this.info(args);
    public static info = (args: any) => console.log(chalk.blue(`[${new Date().toLocaleTimeString("it-IT", {timeZone: "Europe/Rome"})}] [INFO]`), typeof args === 'string' ? chalk.blueBright(args) : args);
    public static warn = (args: any) => console.log(chalk.yellow(`[${new Date().toLocaleTimeString("it-IT", {timeZone: "Europe/Rome"})}] [WARN]`), typeof args === 'string' ? chalk.yellowBright(args) : args);
    public static error = (args: any) => console.log(chalk.red(`[${new Date().toLocaleTimeString("it-IT", {timeZone: "Europe/Rome"})}] [ERROR]`), typeof args === 'string' ? chalk.redBright(args) : args);
    public static success = (args: any) => console.log(chalk.green(`[${new Date().toLocaleTimeString("it-IT", {timeZone: "Europe/Rome"})}] [INIT]`), typeof args === 'string' ? chalk.greenBright(args) : args);
}