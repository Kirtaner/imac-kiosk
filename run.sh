#!/bin/bash
echo "Starting Kiosk"
screen -d -m meteor run --settings settings.json
