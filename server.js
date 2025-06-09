const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { processWebToApk } = require('./src/services/converter');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = uuidv4();
    const userUploadPath = path.join(__dirname, 'uploads', userId);
    fs.ensureDirSync(userUploadPath);
    req.userId = userId;
    cb(null, userUploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.post('/api/convert', upload.fields([
  { name: 'webFiles', maxCount: 1 },
  { name: 'appIcon', maxCount: 1 },
  { name: 'splashScreen', maxCount: 1 }
]), async (req, res) => {
  try {
    const { appName, packageName, versionName, versionCode } = req.body;
    const userId = req.userId;
    
    // Validate inputs
    if (!appName || !packageName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!req.files.webFiles) {
      return res.status(400).json({ error: 'Web files are required' });
    }
    
    const webFilesPath = req.files.webFiles[0].path;
    const appIconPath = req.files.appIcon ? req.files.appIcon[0].path : null;
    const splashScreenPath = req.files.splashScreen ? req.files.splashScreen[0].path : null;
    
    // Process the conversion
    const result = await processWebToApk({
      userId,
      appName,
      packageName,
      versionName: versionName || '1.0.0',
      versionCode: versionCode || '1',
      webFilesPath,
      appIconPath,
      splashScreenPath
    });
    
    res.json({ 
      success: true, 
      message: 'Conversion completed successfully',
      downloadUrl: `/downloads/${result.apkFileName}`,
      buildLog: result.buildLog
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      error: 'Conversion failed', 
      message: error.message 
    });
  }
});

// Download route
app.get('/downloads/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'output', fileName);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Web2App Studio server running on port ${port}`);
  
  // Create necessary directories if they don't exist
  fs.ensureDirSync(path.join(__dirname, 'uploads'));
  fs.ensureDirSync(path.join(__dirname, 'output'));
  fs.ensureDirSync(path.join(__dirname, 'temp'));
}); 