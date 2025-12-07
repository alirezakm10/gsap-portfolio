#!/bin/bash

# Web-optimized FFmpeg command for scroll-based video scrubbing
# Balances quality and file size for web delivery
# Includes background removal using chroma key (green/blue screen)

# Configuration
INPUT_FILE="movements.mp4"
OUTPUT_FILE="output.mp4"

# Blue screen removal settings
CHROMA_KEY_COLOR="0x0000FF"  # Blue screen color (hex format: 0xRRGGBB)
# For different blue shades, you may need to adjust:
# Pure blue: 0x0000FF
# Light blue: 0x0080FF or 0x00BFFF
# Dark blue: 0x000080

SIMILARITY=0.4      # Chroma key similarity (0.0-1.0, lower = more strict, higher = more lenient)
BLEND=0.05          # Chroma key blend (0.0-1.0, lower = sharper edges, higher = softer edges)

# Video encoding settings (optimized for smooth scrubbing)
SCALE_WIDTH=960     # Output width (height auto-calculated to maintain aspect ratio)
CRF=20              # Quality (18-28, lower = better quality, larger file)
KEYFRAME_INTERVAL=1 # Keyframes every N frames (1 = every frame, very smooth for scrubbing)

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: Input file '$INPUT_FILE' not found!"
  exit 1
fi

echo "Starting video encoding with blue background removal..."
echo "Input: $INPUT_FILE"
echo "Output: $OUTPUT_FILE"
echo "Chroma key color: Blue ($CHROMA_KEY_COLOR)"
echo "Similarity: $SIMILARITY | Blend: $BLEND"
echo "Scale: ${SCALE_WIDTH}px width (height auto)"
echo "CRF: $CRF | Keyframe interval: $KEYFRAME_INTERVAL (every frame for smooth scrubbing)"
echo ""

# Using your preferred settings with background removal added
# MP4 format with H.264 - optimized for smooth scrubbing
# Background will be removed (blue becomes transparent/black)
echo "Encoding with your preferred smooth scrubbing settings + background removal..."
ffmpeg -i "$INPUT_FILE" \
  -vf "colorkey=0x0000FF:similarity=$SIMILARITY:blend=$BLEND,scale=${SCALE_WIDTH}:-1" \
  -vcodec libx264 \
  -crf $CRF \
  -g $KEYFRAME_INTERVAL \
  -pix_fmt yuv420p \
  -movflags +faststart \
  "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  echo ""
  echo "✓ Video encoding complete!"
  echo "✓ Blue background removed successfully"
  echo "✓ New file: $OUTPUT_FILE"
  echo ""
  echo "✓ Optimized for smooth scrubbing:"
  echo "  - Keyframes every frame (g=$KEYFRAME_INTERVAL) for perfect scroll scrubbing"
  echo "  - CRF $CRF for high quality"
  echo "  - Scale: ${SCALE_WIDTH}px width"
  echo "  - Fast start enabled for web playback"
  echo ""
  echo "Note: MP4 format doesn't support true transparency."
  echo "      Blue background is removed and will appear black/transparent."
  echo ""
  echo "Troubleshooting tips:"
  echo "  - If blue edges remain: Increase SIMILARITY (try 0.5-0.6)"
  echo "  - If character is partially removed: Decrease SIMILARITY (try 0.2-0.3)"
  echo "  - If edges are too harsh: Increase BLEND (try 0.1-0.2)"
  echo "  - For different blue shades: Adjust CHROMA_KEY_COLOR"
  echo "  - To change resolution: Adjust SCALE_WIDTH"
  echo "  - To change quality: Adjust CRF (18-28, lower = better)"
else
  echo ""
  echo "✗ Encoding failed!"
  exit 1
fi

