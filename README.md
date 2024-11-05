# HVF-plugin

**HVF-plugin** is a Figma plugin designed to export face animation frames from Figma into a custom `.hvf` (Hyogen Vector File) format. This file format is used by Aurora's *HyogenUi* to render expressive facial animations seamlessly in the UI. 


> **Note**: The Figma desktop app is required for development and testing of this plugin.

## Installation

1. Clone the repository or download the plugin files:
  ```bash
   git clone https://github.com/IshantPundir/HVF-plugin.git
   cd HVF-plugin
  ```

2. Install
  ```bash
   npm install -g typescript
   npm install --save-dev @figma/plugin-typing @types/node svg-parser webpack webpack-cli typescript ts-loader svg-path-properties
  ```

3. Run
  ```bash
    npm run build -- --watch
  ```