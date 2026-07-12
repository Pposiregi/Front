# SlimPet Pet Asset Rules

## Scope

- This rule set applies to composable pet part PNG files in:
  - `src/assets/pet/<pet_name>/main/` (main scene parts)
  - `src/assets/pet/<pet_name>/run/` (running scene parts)
- This rule set does not apply to:
  - source folders such as `origin/`
  - effect folders such as `fx/`

## Folder Layout

- `src/assets/pet/<pet_name>/main/`
  - default/main pet composition parts
- `src/assets/pet/<pet_name>/run/`
  - run animation composition parts
- `src/assets/pet/<pet_name>/origin/`
  - source/reference files (not for runtime composition)
- `src/assets/pet/fx/`
  - global/shared fx assets for all pets (not part-layer composition)

## Filename Format

- Required format: `{pet}_{version}_{zIndex}_{part}_{direction}.png`
- Optional level variant format:
  `{pet}_{version}_{zIndex}_{part}_{direction}_lv{n}.png`
  - currently allowed variants: `lv1`, `lv2`, `lv3`
  - use this for alternate body-part art at the same layer, such as torso
    muscle/body-fat levels
- Example token meanings:
  - `pet`: pet key (lowercase letters/numbers, e.g. `browncat`)
  - `version`: `v` + number (e.g. `v1`)
  - `zIndex`: 2-digit layer index (e.g. `00`, `07`, `11`)
- `part`: part name (letters/numbers, `_` allowed)
  - avoid ending `part` names with direction tokens (e.g. `left`, `right`, `up`,
    `down`)
  - this keeps filename parsing deterministic because `direction` is the last
    token in the required format, or the token before `_lv{n}` in variant files
- `direction`: required. use `none` when direction is not needed

## Allowed Direction Values

- `none`
- `left`
- `right`
- `up`
- `down`
- `leftUp`
- `leftDown`
- `rightUp`
- `rightDown`

## Required Size

- Every composable part PNG must be exactly `1024x1024`.

## Valid Filename Examples

- `browncat_v1_00_tail_none.png`
- `browncat_v1_02_torso_none.png`
- `browncat_v1_03_arm_left.png`
- `browncat_v1_07_beard_rightUp.png`
- `browncat_v1_08_eye_right.png`
- `browncat_v1_10_mouth_none.png`
- `browncat_v1_11_neckRuff_none.png`
- `sibadog_v1_02_torso_none_lv1.png`

## Invalid Examples

- `browncat_v1_02_torso.png` (missing direction token, should end with `_none`)
- `browncat_v1_2_torso_none.png` (zIndex must be 2 digits)
- `browncat_1_02_torso_none.png` (version must be like `v1`)

## Validation

- Run:
  - `npm run pet:validate-assets`
- The validator checks:
  - filename convention violations
  - missing/invalid direction token (including missing `_none`)
  - non-`1024x1024` PNG size
  - target scope: `main/` and `run/` part folders under each pet
