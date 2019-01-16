from setuptools import setup, find_packages

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name = "Vicopo",
    version = "1.1.9",
    description = "Vicopo est un moyen léger et rapide rechercher une ville française et implémenter des propositions à la volée, l'autocomplétion d'un champ de ville ou de code postal et la conversion de l'un vers l'autre.",
    long_description = long_description,
    long_description_content_type = "text/markdown",
    author = "kylekatarnls",
    url = "https://github.com/kylekatarnls/vicopo",
    packages = find_packages(),
	scripts = ['Vicopo/Vicopo.py'],
)
