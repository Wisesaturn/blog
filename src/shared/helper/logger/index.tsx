import chalk from 'chalk';

class LoggerModule {
  private baseMessage;

  constructor() {
    this.baseMessage = '';
  }

  log(message: string, err?: Error) {
    const newMessage = this.baseMessage + message;
    console.log(chalk.blueBright(`[LOG] ${newMessage}`, err));
  }

  error(err: Error) {
    const newMessage = this.baseMessage + err.message;
    console.log(chalk.red(`[ERROR] ${newMessage}`, err));
  }

  warn(message: string, err?: Error) {
    const newMessage = this.baseMessage + message;
    console.log(chalk.yellow(`[WARN] ${newMessage}`, err));
  }

  success(message: string, err?: Error) {
    const newMessage = this.baseMessage + message;
    console.log(chalk.green(`[SUCCESS] ${newMessage}`, err));
  }

  update(message: string, err?: Error) {
    const newMessage = this.baseMessage + message;
    console.log(chalk.gray(`[UPDATE] ${newMessage}`, err));
  }

  delete(message: string, err?: Error) {
    const newMessage = this.baseMessage + message;
    console.log(chalk.gray(`[DELETE] ${newMessage}`, err));
  }
}

const Logger = new LoggerModule();

export default Logger;
