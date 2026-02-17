# siba_dog Asset Template Guide

This folder is the working area for `sibadog` composable pet assets.

## Folder layout
- `main/`: layered parts for default scene.
- `run/`: layered parts for running scene.
- `template_main.example.json`: example template for `main/` parts.
- `template_run.example.json`: example template for `run/` parts.

## Naming rules
Use this pattern for runtime part files:

`{pet}_{version}_{zIndex}_{part}_{direction}.png`

Example:
- `sibadog_v1_03_arm_left.png`
- `sibadog_v1_07_mouth_none.png`

Allowed direction tokens:
- `none`
- `left`
- `right`
- `up`
- `down`
- `leftUp`
- `leftDown`
- `rightUp`
- `rightDown`

## Notes
- Keep part PNG size as `1024x1024`.
- These JSON files are examples/templates and are not registered in runtime yet.
- After finalizing assets, wire them in `src/assets/pet/petAssetRegistry.ts`.
