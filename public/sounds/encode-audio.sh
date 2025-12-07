#!/bin/bash

# Web-optimized FFmpeg command for audio conversion
# Converts MP4 audio to lightweight MP3 for web delivery

ffmpeg -i intro-beat.mp4 \
  -vn \
  -acodec libmp3lame \
  -ab 128k \
  -ar 44100 \
  -ac 2 \
  intro-beat.mp3

echo "Audio encoding complete!"
echo "New file: intro-beat.mp3"

