#!/bin/bash
cd /home/kavia/workspace/code-generation/centralized-data-service-platform-235189-235211/centralized_db_dashboard
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

