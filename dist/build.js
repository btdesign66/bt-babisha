const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'dist');

// Directories to ignore during build copy
const ignoreDirs = ['node_modules', 'dist', '.git', '.vercel', 'tmp'];
// Files to ignore during build copy
const ignoreFiles = ['.env', '.env.local', '.gitignore', '.vercelignore', 'package-lock.json'];

function copyRecursive(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            if (ignoreDirs.includes(childItemName)) return;
            copyRecursive(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        const filename = path.basename(src);
        if (ignoreFiles.includes(filename)) return;
        fs.copyFileSync(src, dest);
    }
}

console.log('🚀 Starting babisha build...');
try {
    // Ensure clean dist directory
    if (fs.existsSync(destDir)) {
        console.log('Cleaning existing dist directory...');
        fs.rmSync(destDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(destDir, { recursive: true });
    copyRecursive(srcDir, destDir);
    console.log('✅ Build completed successfully! All assets copied to dist.');
} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
}
