// Auto-deployment helper
const { execSync } = require('child_process');
const fs = require('fs');

function autoCommitAndDeploy(message) {
  try {
    // Update version
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = pkg.version.split('.');
    version[2] = (parseInt(version[2]) + 1).toString();
    pkg.version = version.join('.');
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    
    // Add timestamp
    const timestamp = new Date().toISOString();
    fs.writeFileSync('LAST-DEPLOY.txt', `${timestamp}\n${message}`);
    
    // Git commands
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "${message} - v${pkg.version}"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log(`✅ Deployed v${pkg.version} to Git and Vercel`);
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
}

module.exports = { autoCommitAndDeploy };