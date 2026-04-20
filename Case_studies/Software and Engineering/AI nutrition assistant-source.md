# NutriPal Reference Source

The portfolio no longer tracks a full copy of the NutriPal source inside the main app repo.

Reference source code now lives in the git submodule at `_upstream_nutripal/`, which points to:

- `https://github.com/buildsbyian/AI-nutritional-assistant.git`

If you clone this portfolio repo fresh, initialize the reference repo with:

```bash
git submodule update --init --recursive
```
