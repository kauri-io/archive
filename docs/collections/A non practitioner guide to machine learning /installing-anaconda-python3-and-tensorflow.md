---
title: Installing Anaconda, Python3 and Tensorflow
summary: First thing first, heres a list of the things we need to start playing around with some data- - Python - Anaconda - Jupiter Notebook - A bunch of data manipulation tools like Numpy, Scikit etc.. Luckily for us, the Anaconda distribution includes all of them, head on to https-//www.anaconda.com/distribution/-download-section and follow the instructions. Anaconda homepage On linux is as easy as downloading the file, opening the terminal and type ~$ bash Anaconda3- from the folder you downloaded th
authors:
  - Davide Scalzo (@davidescalzo)
date: 2019-10-22
some_url: 
---

# Installing Anaconda, Python3 and Tensorflow

First thing first, here's a list of the things we need to start playing around with some data:
- Python
- Anaconda
- Jupiter Notebook
- A bunch of data manipulation tools like Numpy, Scikit etc..

Luckily for us, the Anaconda distribution includes all of them, head on to https://www.anaconda.com/distribution/#download-section and follow the instructions.

![Anaconda homepage](https://api.kauri.io:443/ipfs/QmWhCsbMdjfn12ZpvmnWG7RnR4fxoDdwo4LTCrgQMjKK6M)

On linux is as easy as downloading the file, opening the terminal and type `~$ bash Anaconda3-<release>` from the folder you downloaded the installer in.

```
Welcome to Anaconda3 2019.07

In order to continue the installation process, please review the license
agreement.
Please, press ENTER to continue
>>> 
```

then tap the Enter key. A wall of text will show up, you can read it (or not) and just skip to accepting the license terms, type `yes`

```
Anaconda3 will now be installed into this location:
/home/davide/anaconda3

  - Press ENTER to confirm the location
  - Press CTRL-C to abort the installation
  - Or specify a different location below

[/home/davide/anaconda3] >>> 
```

Once the installer has finished it will ask you if you want to initialise Anaconda, type `yes`
```
installation finished.
Do you wish the installer to initialize Anaconda3
by running conda init? [yes|no]
[no] >>> 
```

All done! But wait...

If you try to start the Python REPL by typing `python` in your terminal, you'll still get the default python edition shipped with your system, or an error if no python was shipped with your OS. We need to add Anaconda to our PATH

```
~$ source .bashrc
~$ python
~$ python
Python 3.7.3 (default, Mar 27 2019, 22:11:17) 
[GCC 7.3.0] :: Anaconda, Inc. on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 
```
the Anaconda distribution is now running on your system, well done!

Now let's check that a few more things are working correctly type the following in your terminal
```
~$ jupyter notebook
```

You should see the Jupyter Notebook starting up in a new tab in your default browser.

![Jupyter notebook file browser](https://api.kauri.io:443/ipfs/QmYKoL55dk3MbPxmmgJddirEkhsJRQV5mZ5nXv8ZdMvnob)

Create a new Jupyter Notebook document and type the following

```
from sklearn.ensemble import RandomForestRegressor
?RandomForestRegressor
```

The first line will import a Regressor from sci-kit learn and the second line will display the source code of that function thanks to the `?`

![Jupyter notebook](https://api.kauri.io:443/ipfs/Qmf58ig45auRigrBQA6ykZDcX1Rbh8uxT6LXHo5e28oG9k)


Finally, we want to install Tensorflow. Tensorflow is Google's open source framework for building and evaluating neural network systems and it does have libraries for Python, JS and a lite version for mobile and IOT. To install it type `pip install tensorflow` and on your newly created notebook add the following:

```python
import tensorflow as tf
print(tf.__version__)
```

You should see the tensorflow version printed out, `1.14.0` at the time of writing.

We are ready to go! The Anaconda distribution installed the `conda` package manager, Python3, Jupyter Notebook and a bunch of libraries we'll need to build our models.

Well done so far and let's start building our first model!



