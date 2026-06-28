# ⏱️ Vite Timer & Time Calculator

A mobile-first web application designed for timing management, featuring a stopwatch/timer and a time calculator. Built with TypeScript and native Web Components (using Shadow DOM), it leverages the standard Temporal API for precise duration arithmetic.

## Purpose

The application provides a clean, responsive interface to:
* Track elapsed time with millisecond precision.
* Log and calculate cumulative time spans across multiple entries.
* Manage time logs dynamically (adding, list rendering, and deleting).

## Usage

* **Timer:** Use the start/pause/reset controls to track time. Once paused, click the import button to send the logged time directly into the calculator.
* **Calculator:** Add time entries manually (specifying hours, minutes, and seconds) or receive them from the timer. Individual entries are listed as independent components and can be removed. The total duration is calculated instantly using duration math.

## How to Run

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

Copyright &copy; 2026 Douglas Modena.
