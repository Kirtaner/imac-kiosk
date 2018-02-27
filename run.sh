#!/bin/bash
echo "Starting Kiosk"
screen -d -m meteor run --allow-superuser --settings settings.json
