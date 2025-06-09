const fs = require('fs-extra');
const path = require('path');
const extract = require('extract-zip');
const shell = require('shelljs');
const archiver = require('archiver');

/**
 * Process the web files and convert them to an APK
 * @param {Object} options - Conversion options
 * @returns {Promise<Object>} Result with APK file name and build log
 */
async function processWebToApk(options) {
  const {
    userId,
    appName,
    packageName,
    versionName,
    versionCode,
    webFilesPath,
    appIconPath,
    splashScreenPath
  } = options;

  const workDir = path.join(__dirname, '../../temp', userId);
  const webAssetsDir = path.join(workDir, 'web-assets');
  const androidProjectDir = path.join(workDir, 'android-project');
  const outputDir = path.join(__dirname, '../../output');

  try {
    // Create necessary directories
    fs.ensureDirSync(workDir);
    fs.ensureDirSync(webAssetsDir);
    fs.ensureDirSync(androidProjectDir);
    
    // Step 1: Extract web files if it's a zip
    const fileExt = path.extname(webFilesPath).toLowerCase();
    if (fileExt === '.zip') {
      await extractZipFile(webFilesPath, webAssetsDir);
    } else {
      // If it's not a zip, copy the file directly
      fs.copySync(webFilesPath, path.join(webAssetsDir, path.basename(webFilesPath)));
    }

    // Step 2: Validate web content
    validateWebContent(webAssetsDir);

    // Step 3: Create a Capacitor project
    await createCapacitorProject(workDir, appName, packageName);

    // Step 4: Copy web assets to Capacitor www folder
    const wwwDir = path.join(workDir, 'www');
    fs.ensureDirSync(wwwDir);
    fs.copySync(webAssetsDir, wwwDir);

    // Step 5: Update app configuration
    updateAppConfig(workDir, {
      appName,
      packageName,
      versionName,
      versionCode
    });

    // Step 6: Process custom resources (icon, splash)
    if (appIconPath) {
      processAppIcon(workDir, appIconPath);
    }
    
    if (splashScreenPath) {
      processSplashScreen(workDir, splashScreenPath);
    }

    // Step 7: Add Android platform
    await addAndroidPlatform(workDir);

    // Step 8: Build the APK
    const buildLog = await buildApk(workDir);

    // Step 9: Copy APK to output directory
    const apkFileName = `${appName.replace(/[^a-zA-Z0-9]/g, '_')}_${versionName}.apk`;
    const apkPath = path.join(workDir, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
    fs.copySync(apkPath, path.join(outputDir, apkFileName));

    return {
      apkFileName,
      buildLog
    };
  } catch (error) {
    console.error('Error in processWebToApk:', error);
    throw error;
  } finally {
    // Cleanup temp files
    try {
      fs.removeSync(workDir);
    } catch (e) {
      console.error('Error cleaning up temp files:', e);
    }
  }
}

/**
 * Extract a zip file to a destination directory
 * @param {string} zipPath - Path to the zip file
 * @param {string} destDir - Destination directory
 */
async function extractZipFile(zipPath, destDir) {
  try {
    await extract(zipPath, { dir: destDir });
    console.log('Extraction complete');
  } catch (error) {
    console.error('Extraction failed:', error);
    throw new Error('Failed to extract web files: ' + error.message);
  }
}

/**
 * Validate the web content
 * @param {string} webDir - Directory containing web files
 */
function validateWebContent(webDir) {
  // Check if index.html exists
  const indexHtmlPath = path.join(webDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error('index.html not found in the uploaded web files');
  }
  
  // Additional validation could be done here
  console.log('Web content validation passed');
}

/**
 * Create a new Capacitor project
 * @param {string} workDir - Working directory
 * @param {string} appName - Application name
 * @param {string} packageName - Package name
 */
async function createCapacitorProject(workDir, appName, packageName) {
  // Create a basic package.json for the project
  const packageJson = {
    name: appName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    version: '1.0.0',
    description: 'Web to APK conversion',
    main: 'index.js',
    dependencies: {
      '@capacitor/core': '^4.0.0',
      '@capacitor/android': '^4.0.0',
      '@capacitor/cli': '^4.0.0'
    }
  };
  
  fs.writeFileSync(
    path.join(workDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create capacitor.config.json
  const capacitorConfig = {
    appId: packageName,
    appName: appName,
    webDir: 'www',
    bundledWebRuntime: false
  };
  
  fs.writeFileSync(
    path.join(workDir, 'capacitor.config.json'),
    JSON.stringify(capacitorConfig, null, 2)
  );
  
  // In a real environment, we would run npm install here
  // For this demo, we're simulating this part
  console.log('Capacitor project created');
}

/**
 * Update the app configuration with custom settings
 * @param {string} workDir - Working directory
 * @param {Object} config - Configuration object
 */
function updateAppConfig(workDir, config) {
  const capacitorConfigPath = path.join(workDir, 'capacitor.config.json');
  const capacitorConfig = JSON.parse(fs.readFileSync(capacitorConfigPath, 'utf8'));
  
  // Update the config
  capacitorConfig.appName = config.appName;
  capacitorConfig.appId = config.packageName;
  
  // Write back the updated config
  fs.writeFileSync(
    capacitorConfigPath,
    JSON.stringify(capacitorConfig, null, 2)
  );
  
  console.log('App configuration updated');
}

/**
 * Process and apply the app icon
 * @param {string} workDir - Working directory
 * @param {string} iconPath - Path to the icon file
 */
function processAppIcon(workDir, iconPath) {
  // In a real implementation, this would resize the icon to various dimensions
  // and copy them to the appropriate Android resource directories
  console.log('App icon processed');
}

/**
 * Process and apply the splash screen
 * @param {string} workDir - Working directory
 * @param {string} splashPath - Path to the splash screen image
 */
function processSplashScreen(workDir, splashPath) {
  // In a real implementation, this would resize the splash screen image
  // and copy it to the appropriate Android resource directories
  console.log('Splash screen processed');
}

/**
 * Add the Android platform to the Capacitor project
 * @param {string} workDir - Working directory
 */
async function addAndroidPlatform(workDir) {
  // In a real implementation, this would run:
  // npx cap add android
  
  // For this demo, we'll create a simulated Android project structure
  const androidDir = path.join(workDir, 'android');
  fs.ensureDirSync(androidDir);
  fs.ensureDirSync(path.join(androidDir, 'app'));
  fs.ensureDirSync(path.join(androidDir, 'app', 'src'));
  fs.ensureDirSync(path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug'));
  
  // Create a dummy APK file for demonstration
  fs.writeFileSync(
    path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk'),
    'Dummy APK content'
  );
  
  console.log('Android platform added');
}

/**
 * Build the Android APK
 * @param {string} workDir - Working directory
 * @returns {string} Build log
 */
async function buildApk(workDir) {
  // In a real implementation, this would run:
  // npx cap sync android
  // cd android && ./gradlew assembleDebug
  
  // For this demo, we'll simulate the build process
  console.log('Building APK...');
  
  // Simulate a build delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const buildLog = 'Simulated build log:\n' +
    '> Task :app:preBuild UP-TO-DATE\n' +
    '> Task :app:preDebugBuild UP-TO-DATE\n' +
    '> Task :app:compileDebugJavaWithJavac\n' +
    '> Task :app:packageDebug\n' +
    '> Task :app:assembleDebug\n' +
    'BUILD SUCCESSFUL in 2s\n' +
    '6 actionable tasks: 2 executed, 4 up-to-date';
  
  console.log('APK built successfully');
  
  return buildLog;
}

module.exports = {
  processWebToApk
}; 