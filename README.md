# Web2App Studio

A powerful tool that converts websites (HTML, CSS, JavaScript) into Android APK files without requiring users to write any code.

## Features

- **No-Code Conversion**: Convert any website into a native Android app without writing a single line of code
- **User-Friendly Interface**: Simple drag-and-drop interface for uploading web files
- **Customization Options**: Configure app name, package name, version, and customize app icon and splash screen
- **Instant APK Generation**: Get a ready-to-install APK file in minutes
- **QR Code Download**: Easily transfer the APK to your device using a QR code

## System Requirements

- Node.js 14.x or higher
- NPM 6.x or higher
- For full APK generation (production use):
  - Java Development Kit (JDK) 8 or higher
  - Android SDK
  - Gradle

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/web2app-studio.git
   cd web2app-studio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How It Works

1. **Upload Web Files**: Package your website files (HTML, CSS, JS) in a ZIP file and upload them
2. **Configure Your App**: Enter app details like name, package name, and version
3. **Customize Appearance**: Optionally add a custom app icon and splash screen
4. **Generate APK**: The system will process your files and create an Android APK
5. **Download & Install**: Get your APK file ready to install on any Android device

## Technical Architecture

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js with Express
- **APK Generation**: Capacitor/Cordova to wrap web content in a native container
- **Build System**: Android SDK and Gradle for APK compilation

## Demo Mode

By default, this project runs in demo mode, which simulates the APK build process without actually requiring the Android SDK. This is perfect for testing and demonstration purposes.

For production use with actual APK generation, additional setup is required. See the Production Setup section.

## Production Setup

For production use with actual APK generation:

1. Install the Android SDK and set the ANDROID_HOME environment variable
2. Install the JDK and set the JAVA_HOME environment variable
3. Update the `src/services/converter.js` file to use actual build commands instead of simulations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Capacitor/Cordova for providing the native container technology
- The Android team for their development tools
- All contributors to this project #
