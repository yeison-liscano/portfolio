---
title: Python Virtual Environments
pubDate: 2024-11-04
description: "Python Virtual Environments"
tags: ["python"]
snippet:
  language: "docker"
  code: "
FROM python:3.7\n
WORKDIR ['/app']\n
COPY ['requirements.txt', '/app']\n
RUN ['pip', 'install', '--no-cache-dir', 'upgrade', '-r', 'requirements.txt']\n
COPY ['/app', '/app']\n
CMD ['uvicorn', 'app:app', '--host', '0.0.0.0', '--port', '80'
"
---

Virtual environments are used to create an isolated environment for Python
projects. This means that each project can have its own dependencies,
regardless of what dependencies every other project has.
First of all let's review how to install, update, and uninstall packages
in a virtual environment with pip.
Note: The command specified below are for linux (ubuntu) and MAC OS.

> Contains a specific Python interpreter and software libraries and
> binaries which are needed to support a project (library or application).
> These are by default isolated from software in other virtual environments
> and Python interpreters and libraries installed in the operating system.
> [Python docs](https://docs.python.org/3/library/venv.html)

## Freezing packages (PIP)

To freeze the packages installed in the virtual environment, you can use the
`freeze` command. This will create a `requirements.txt` file with all the
packages installed in the virtual environment and their respective versions

```bash
pip3 freeze > requirements.txt
```

## Installing packages (PIP)

```bash
pip3 install {package_name}
pip3 install -r requirements.txt
```

## Uninstalling packages

```bash
pip3 uninstall {package_name}
```

## Updating packages

```bash
pip3 install --upgrade {package_name}
```

## Creating a virtual environment

To create a virtual environment, you could use the `venv` module that
comes with Python, this is the recommended way to create virtual environments.

### venv (built-in module in python 3.3+)

Extracted from [python venv docs](https://docs.python.org/3/library/venv.html)
A virtual environment is (amongst other things):

Used to contain a specific Python interpreter and software libraries and
binaries which are needed to support a project (library or application). These
are by default isolated from software in other virtual environments and Python
interpreters and libraries installed in the operating system.

Contained in a directory, conventionally named .venv or venv in the project
directory, or under a container directory for lots of virtual environments,
such as ~/.virtualenvs.

Not checked into source control systems such as Git.

Considered as disposable – it should be simple to delete and recreate it from
scratch. You don't place any project code in the environment.

Not considered as movable or copyable – you just recreate the same environment
in the target location.

```bash
# Run the venv module as a script with the -m option, passing the route
# where the virtual environment info will be store (environment name).
python3 -m venv {env_name}
source {env_name}/bin/activate
pip3 install -r requirements.txt
pip3 freeze > requirements.txt
deactivate
```

### pipenv

Extracted from [pipenv docs](https://pipenv.pypa.io/en/latest/) The problems
that Pipenv seeks to solve are multi-faceted:

- You no longer need to use pip and virtualenv separately: they work together.

- Managing a requirements.txt file with package hashes can be problematic.
  Pipenv uses Pipfile and Pipfile.lock to separate abstract dependency
  declarations from the last tested combination.

- Hashes are documented in the lock file which are verified during install.
  Security considerations are put first.

- Strongly encourage the use of the latest versions of dependencies to minimize
  security risks arising from outdated components.

- Gives you insight into your dependency graph (e.g. $ pipenv graph).

- Streamline development workflow by supporting local customizations with
  .env files.

```bash
pip3 install pipenv
cd {project_dir}
pipenv install -r requirements.txt
pipenv uninstall {package_name}
pipenv install -e git+repo_url@branch#egg=package_name
# Run a script using pipenv run
pipenv run python main.py
# install a package from a git repo
pipenv shell
pipenv lock # creates a Pipfile.lock file
exit
```

Install all the packages in the Pipfile.lock file (replicates the environment)

```bash
pipenv install --ignore-pipfile
pipenv graph # shows the dependency graph
pipenv check # checks for security vulnerabilities
exit
```

### virtualenv (Lower level)

> virtualenv can help you. It creates an environment that has its own
> installation directories, that doesn't share libraries with other virtualenv
> environments (and optionally doesn't access the globally installed libraries
> either). [virtualenv docs](https://virtualenv.pypa.io/en/latest/)

```bash
# basic usage
pip3 install virtualenv
cd project_folder
virtualenv venv
source venv/bin/activate
pip install requests
deactivate

# specify the python version, note that the python version must be installed
# in the system.
virtualenv --python=/usr/bin/python2.7 {env_name}
lsvirtualenv # list all the virtual environments
source {env_name}/bin/activate
pip install -r requirements.txt # All other pip commands work as usual
deactivate
rm -rf {env_name} # remove the virtual environment
```

To delete a virtual environment, just delete its folder.
(In this case, it would be rm -rf venv.)

## Isolating the versions of Python

Different projects may require different versions of Python.
To isolate the versions of Python, you can use `pyenv` or `pyenv-virtualenv`.

### pyenv (does not work on windows)

It allows you to create virtual environments for different versions of python.
`pyenv install --list` to see all the versions of python available.
`pyenv versions` to see all the versions of python installed.
`pyenv virtualenvs` to see all the virtual environments created.
`pyenv global {version}` to set the global version of python.
`pyenv local {version}` to set the local version of python.
`pyenv shell {version}` to set the shell version of python.

```bash
pip3 install pyenv
pyenv install {version}
pyenv virtualenv {env_name}
pyenv activate {env_name}
pyenv deactivate
```

### pyenv-virtualenv

```bash
pyenv install {version}
pyenv virtualenv {version} {env_name}
pyenv local {env_name}
```

### Anaconda

Anaconda is a free and open-source distribution of the Python and R programming
languages for scientific computing, that aims to simplify package management
and deployment.

```bash
wget -O anaconda.sh https://repo.anaconda.com/archive/Anaconda3-2022.10-Linux-x86_64.sh
bash anaconda.sh
#source ~/.bashrc
conda info
conda create --name {env_name} python={version}
conda activate {env_name}
conda install {package_name}
conda list
conda update {package_name}
conda remove {package_name}
conda deactivate
conda remove --name {env_name} --all
conda create --name {env_name} --clone {env_name} # clone an environment
conda env export > environment.yml # export an environment
conda env create -f environment.yml # create an environment from a yml file
conda env list
conda env remove -n {env_name} # remove an environment
```

some useful commands

```bash
conda list # list all the packages installed in the current environment
# list all the packages installed in the current environment with their versions
conda list --explicit
# install a package from a specific channel
conda install --channel {conda-forge} {package_name}
conda list --revisions # list all the revisions of the environment
 # install a specific revision of the environment
conda install --revision {revision_number}
# export the environment to a yml file
conda env export --from-history --file environment.yml
```

### Mamba

Mamba is a fast, drop-in replacement for the conda package manager.
It is a C++ implementation of the conda package manager, that uses
multi-threading and a sophisticated dependency solver to achieve maximum performance.

```bash
conda install -c conda-forge mamba
mamba --help
mamba create --name {env_name} python={version}
mamba activate {env_name}
mamba install {package_name}
mamba list
mamba update {package_name}
mamba remove {package_name}
mamba deactivate
mamba env create -f environment.yml # create an environment from a yml file
```

### Docker

Docker is a containerization platform that allows you to create and run containers.
Docker containers are isolated environments that run on a single host.
To install docker on ubuntu, follow
[this](https://docs.docker.com/engine/install/ubuntu/) tutorial.

<!-- ```bash
docker run -it --rm -v $(pwd):/app -w /app python:3.7 bash
``` -->

#### Dockering a python script

```docker
# Dockerfile
FROM python:3.7
WORKDIR ["/app"]
COPY ["requirements.txt", "/app"]
RUN ["pip", "install", "--no-cache-dir", "upgrade", "-r", "requirements.txt"]
COPY ["app.py", "/app"] # copy the app.py file to the /app directory if you want to run the app
CMD ["python", "app.py"]
```

Alternatively, you can use docker-compose to build and run the docker container.

```docker
# docker-compose.yml
services:
    app-csv:
        build:
            context: .
            dockerfile: Dockerfile
        volumes:
            - .:/app
```

```bash
docker-compose build
docker-compose up -d
docker-compose ps
docker-compose logs
docker-compose exec app-csv bash
cd /app
python3 app.py
exit
docker-compose down
```

#### Dockering a flask app

```docker
# Dockerfile
FROM python:3.7
WORKDIR ["/app"]
COPY ["requirements.txt", "/app"]
RUN ["pip", "install", "--no-cache-dir", "upgrade", "-r", "requirements.txt"]
COPY ["/app", "/app"]
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]
```

```docker
# docker-compose.yml
services:
    app-flask:
        build:
            context: .
            dockerfile: Dockerfile
        volumes:
            - .:/app
        ports:
            - "80:80"
```

```bash
docker-compose build
docker-compose up -d
docker-compose ps
```

### Recommendations

- Use `mamba` to manage the versions of Python.
- Use `pipenv` to manage the packages of your project.

#### Divide and conquer

more info in the [Snakemake documentation](https://snakemake.readthedocs.io/en/stable/snakefiles/deployment.html#integrated-package-management)
