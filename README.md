### Make ASCII art
Python3 tool for generating ASCII images
#### Setup
Project uses `pip-tools` and virtual environment (`venv`) for managing dependencies. Clone the repository and `cd` into the project, then run:
- `python3 -m venv venv && . venv/bin/activate && pip install pip-tools && pip-compile && pip-sync`
- Add photographs (`.png, .jpg`) to be converted to ASCII art into `images` directory.
#### Generating ASCII art
`cd` into `src` directory and run `python3 python-generate-ascii.py`. ASCII art is generated in the `results/` directory. A new directory is generated inside results/ based on parameter values. These parameters can be changed in `python-generate-ascii.py`.
