@echo off
echo Committing and Pushing fixes to GitHub...
git add .
git commit -m "fix: resolve 404 and white page issues"
git push origin main
echo.
echo Deployment triggered! Please wait 1 minute for GitHub Actions to finish.
pause
