@echo off
echo =========================================
echo BlockVote - Voter Details Fetcher
echo =========================================
echo Connecting to the local database...
cd backend
node fetch_voters.js
pause
