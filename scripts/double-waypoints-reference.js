// Helper script to double castle and shrine coordinates
// Run this manually in your browser console or use find/replace

// CASTLE - Double all these values in renderHelpers.js lines 113-144:
// Line 115: -12 -> -24,  -8 -> -16,  24 -> 48,  16 -> 32
// Line 118: -14 -> -28,  -16 -> -32,  8 -> 16,  12 -> 24
// Line 119: +6 -> +12,  -16 -> -32,  8 -> 16,  12 -> 24
// Line 124: -14 -> -28,  i*4 -> i*8,  -18 -> -36,  3 -> 6,  2 -> 4
// Line 125: +6 -> +12,  i*4 -> i*8,  -18 -> -36,  3 -> 6,  2 -> 4
// Line 130: -4 -> -8,  -4 -> -8,  8 -> 16,  12 -> 24
// Line 134: lineWidth 2 -> 3
// Line 136-137: -16 -> -32,  -26 -> -52
// Line 141-143: -26 -> -52,  +8 -> +16,  -22 -> -44,  -18 -> -36

// SHRINE - Double all these values in renderHelpers.js lines 151-186:
// Line 153: -16 -> -32,  +6 -> +12,  32 -> 64,  4 -> 8
// Line 154: -14 -> -28,  +2 -> +4,  28 -> 56,  4 -> 8
// Line 159-165: -12 -> -24,  +2 -> +4,  -8 -> -16,  -12 -> -24,  -16 -> -32
// Line 171: -10 -> -20,  -6 -> -12,  3 -> 6,  8 -> 16
// Line 172: +7 -> +14,  -6 -> -12,  3 -> 6,  8 -> 16
// Line 176: lineWidth 3 -> 4
// Line 178: -6 -> -12,  18 -> 36
// Line 183: -10 -> -20,  4 -> 8

console.log('Copy the values above and manually edit renderHelpers.js');
