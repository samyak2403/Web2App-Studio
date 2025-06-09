document.addEventListener('DOMContentLoaded', function() {
    // Step navigation
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    const step1Content = document.getElementById('step1-content');
    const step2Content = document.getElementById('step2-content');
    const step3Content = document.getElementById('step3-content');
    
    const toStep2Button = document.getElementById('to-step2');
    const toStep1Button = document.getElementById('to-step1');
    const toStep3Button = document.getElementById('to-step3');
    const startOverButton = document.getElementById('start-over');
    
    // File upload variables
    const uploadArea = document.getElementById('upload-area');
    const fileUpload = document.getElementById('file-upload');
    const uploadInfo = document.getElementById('upload-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFileButton = document.getElementById('remove-file');
    
    // App config form
    const appConfigForm = document.getElementById('app-config-form');
    const appIconUpload = document.getElementById('app-icon-upload');
    const splashScreenUpload = document.getElementById('splash-screen-upload');
    const appIconName = document.getElementById('app-icon-name');
    const splashScreenName = document.getElementById('splash-screen-name');
    
    // Build & download elements
    const progressBar = document.getElementById('progress-bar');
    const buildSuccessDiv = document.getElementById('build-success');
    const buildErrorDiv = document.getElementById('build-error');
    const errorDetails = document.getElementById('error-details');
    const buildLogContainer = document.getElementById('build-log-container');
    const buildLog = document.getElementById('build-log');
    const downloadApkButton = document.getElementById('download-apk');
    const qrCodeDiv = document.getElementById('qr-code');
    
    // Store uploaded files
    let webFilesData = null;
    let appIconData = null;
    let splashScreenData = null;
    
    // Step navigation functions
    function goToStep(stepNumber) {
        // Hide all steps
        step1.classList.remove('active', 'completed');
        step2.classList.remove('active', 'completed');
        step3.classList.remove('active', 'completed');
        
        step1Content.classList.remove('active');
        step2Content.classList.remove('active');
        step3Content.classList.remove('active');
        
        // Show the current step
        if (stepNumber === 1) {
            step1.classList.add('active');
            step1Content.classList.add('active');
        } else if (stepNumber === 2) {
            step1.classList.add('completed');
            step2.classList.add('active');
            step2Content.classList.add('active');
        } else if (stepNumber === 3) {
            step1.classList.add('completed');
            step2.classList.add('completed');
            step3.classList.add('active');
            step3Content.classList.add('active');
            
            // Start build process
            startBuildProcess();
        }
    }
    
    // File upload handling
    function handleFileUpload(file) {
        if (!file) return;
        
        // Check if file is a zip
        if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
            alert('Please upload a ZIP file containing your website files.');
            return;
        }
        
        // Store the file
        webFilesData = file;
        
        // Show file info
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        // Show upload info and enable next button
        uploadArea.style.display = 'none';
        uploadInfo.style.display = 'block';
        toStep2Button.disabled = false;
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Start the build process
    function startBuildProcess() {
        // Reset UI
        progressBar.style.width = '0%';
        buildSuccessDiv.style.display = 'none';
        buildErrorDiv.style.display = 'none';
        buildLogContainer.style.display = 'none';
        
        // Simulate progress (in a real app, this would update based on backend progress)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                finishBuild();
            }
        }, 300);
        
        // Get form data
        const appName = document.getElementById('app-name').value;
        const packageName = document.getElementById('package-name').value;
        const versionName = document.getElementById('version-name').value;
        const versionCode = document.getElementById('version-code').value;
        
        // Create form data
        const formData = new FormData();
        formData.append('webFiles', webFilesData);
        formData.append('appName', appName);
        formData.append('packageName', packageName);
        formData.append('versionName', versionName);
        formData.append('versionCode', versionCode);
        
        if (appIconData) {
            formData.append('appIcon', appIconData);
        }
        
        if (splashScreenData) {
            formData.append('splashScreen', splashScreenData);
        }
        
        // In a real app, send the form data to the server
        // fetch('/api/convert', {
        //     method: 'POST',
        //     body: formData
        // })
        // .then(response => response.json())
        // .then(data => {
        //     clearInterval(interval);
        //     progressBar.style.width = '100%';
        //     if (data.success) {
        //         showBuildSuccess(data);
        //     } else {
        //         showBuildError(data.error);
        //     }
        // })
        // .catch(error => {
        //     clearInterval(interval);
        //     showBuildError('Failed to communicate with the server: ' + error.message);
        // });
    }
    
    // Show build success
    function finishBuild() {
        // Show a simulated build log
        const simulatedLog = `> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:checkDebugManifest UP-TO-DATE
> Task :app:processDebugManifest UP-TO-DATE
> Task :app:compileDebugJavaWithJavac
> Task :app:compileDebugSources
> Task :app:mergeDebugResources
> Task :app:packageDebug
> Task :app:assembleDebug
BUILD SUCCESSFUL in 8s
8 actionable tasks: 5 executed, 3 up-to-date`;

        buildLog.textContent = simulatedLog;
        buildLogContainer.style.display = 'block';
        
        // Show success message (in a real app, only after confirmed success)
        setTimeout(() => {
            buildSuccessDiv.style.display = 'block';
            
            // Set up the download link (this would be the actual link in a real app)
            const appName = document.getElementById('app-name').value;
            const versionName = document.getElementById('version-name').value;
            const downloadLink = `/downloads/${appName.replace(/[^a-zA-Z0-9]/g, '_')}_${versionName}.apk`;
            downloadApkButton.href = downloadLink;
            
            // Generate QR code
            if (window.QRCode) {
                qrCodeDiv.innerHTML = '';
                new QRCode(qrCodeDiv, {
                    text: window.location.origin + downloadLink,
                    width: 200,
                    height: 200
                });
            }
        }, 1000);
    }
    
    // Show build error
    function showBuildError(message) {
        buildErrorDiv.style.display = 'block';
        errorDetails.textContent = message;
    }
    
    // Event Listeners
    
    // File drag & drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    // File upload click
    uploadArea.addEventListener('click', () => {
        fileUpload.click();
    });
    
    fileUpload.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
    
    // Remove file button
    removeFileButton.addEventListener('click', () => {
        webFilesData = null;
        uploadArea.style.display = 'block';
        uploadInfo.style.display = 'none';
        toStep2Button.disabled = true;
        fileUpload.value = '';
    });
    
    // App icon upload
    appIconUpload.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            appIconData = e.target.files[0];
            appIconName.textContent = e.target.files[0].name;
        }
    });
    
    // Splash screen upload
    splashScreenUpload.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            splashScreenData = e.target.files[0];
            splashScreenName.textContent = e.target.files[0].name;
        }
    });
    
    // Step navigation buttons
    toStep2Button.addEventListener('click', () => {
        goToStep(2);
    });
    
    toStep1Button.addEventListener('click', () => {
        goToStep(1);
    });
    
    appConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();
        goToStep(3);
    });
    
    startOverButton.addEventListener('click', () => {
        // Reset all form data
        webFilesData = null;
        appIconData = null;
        splashScreenData = null;
        
        uploadArea.style.display = 'block';
        uploadInfo.style.display = 'none';
        toStep2Button.disabled = true;
        fileUpload.value = '';
        appIconUpload.value = '';
        splashScreenUpload.value = '';
        appIconName.textContent = 'No file chosen';
        splashScreenName.textContent = 'No file chosen';
        
        // Go back to step 1
        goToStep(1);
    });
}); 