#!/bin/bash

# Navigate to the client directory and start the client server
echo "Starting client server..."
cd client
yarn dev &

# Navigate to the server directory and start the server
echo "Starting backend server..."
cd ../backend
yarn dev &

# Navigate to the admin directory and start the admin server
echo "Starting admin server..."
cd ../admin
yarn dev &

# Wait for all background processes to finish
wait
