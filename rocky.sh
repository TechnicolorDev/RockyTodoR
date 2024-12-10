#!/bin/bash

# Function to start the app and show the startup message
start_app() {
  echo "Starting Rocky application..."

  # PM2 start command
  pm2 start server.js --name rocky

  # Show the startup message
  echo "Server is now running on http://localhost:3000"
  echo "Simple Daemon is ready to fly!"
  echo "✔️ Successfully connected to Redis! 🎉"
  echo "Job queue is now processing jobs..."
  echo "Database initialized."
}

# Function to stop the app
stop_app() {
  echo "Stopping Rocky application..."

  # PM2 stop command
  pm2 stop rocky
}

# Function to restart the app
restart_app() {
  echo "Restarting Rocky application..."

  # PM2 restart command
  pm2 restart rocky
}

# Parse the command-line argument
case $1 in
  --start-now)
    start_app
    ;;
  --stop-now)
    stop_app
    ;;
  --restart-now)
    restart_app
    ;;
  *)
    echo "Usage: $0 {--start-now|--stop-now|--restart-now}"
    exit 1
    ;;
esac
