---
title: Multi-class classification example with Convolutional Neural Network in Keras and Tensorflow
summary: In the previous articles, we have looked at a regression problem and a binary classification problem. Lets now look at another common supervised learning problem, multi-class classification. The staple training exercise for multi-class classification is the MNIST dataset, a set of handwritten roman numerals, while particularly useful, we can spice it up a little and use the Kannada MNIST dataset available on Kaggle. The Kannada language is spoken in southern regions of India, by around 45 millio
authors:
  - Davide Scalzo (@davidescalzo)
date: 2019-10-09
some_url: 
---

# Multi-class classification example with Convolutional Neural Network in Keras and Tensorflow

In the previous articles, we have looked at a regression problem and a binary classification problem. Let's now look at another common supervised learning problem, multi-class classification.

The staple training exercise for multi-class classification is the MNIST dataset, a set of handwritten roman numerals, while particularly useful, we can spice it up a little and use the  [Kannada MNIST dataset](https://www.kaggle.com/c/Kannada-MNIST) available on Kaggle.

The Kannada language is spoken in southern regions of India, by around 45 million people, and compared to roman numerals provides the advantage of being a lot less familiar to most people and also provides a little extra challenge due to similarity between some of its numerals.

Let's get cracking!

Firstly, [download the data from the Kaggle competition website ](https://www.kaggle.com/c/Kannada-MNIST/data).

Once your data is unpacked and your Jupyter Notebook (or Python IDE, whatever you prefer) is all fired up, let's start importing the required modules:

```python
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dropout, Dense, Conv2D, MaxPool2D, Flatten
from tensorflow.keras.callbacks import TensorBoard
import matplotlib.pyplot as plt
import seaborn as sns
import random
import time
print(tf.__version__)
```

If you are running the GPU version of Tensorflow, it's always nice to check that the GPUs are in fact available. Particularly with Convolutional Neural Network (or CNN  for short) GPUs can speed up your training process up to 100x. Let's make sure that GPU power is at our fingertips.

```
gpus = tf.config.experimental.list_physical_devices('GPU')
print("GPUs Available: ", len(gpus))
tf.config.experimental.set_memory_growth(gpus[0], True)python
```

The train dataset contains 60,000 samples, but we have no validation set, so we would to set  aside around  8-10% of samples for the validation step.

```python
VALIDATION_SET = 5000 # define the length of the validation set

# load the data

VALIDATION_SET = 5000

train_raw_data = pd.read_csv('../input/Kannada-MNIST/train.csv')
test_raw_data = pd.read_csv('../input/Kannada-MNIST/test.csv')

def split_sets(x):
    x = x.sample(frac=1, axis=0) # shuffling the content to ensure the model doesn't learn about the order of the items
    val = x[:VALIDATION_SET]
    train = x[VALIDATION_SET:]
    val.reset_index(drop=True, inplace=True)
    train.reset_index(drop=True, inplace=True)
    y_train = train['label']
    x_train = train.drop(['label'], axis=1) / 255 # normalizing the 0 - 255 scale to 0 -1
    y_val = val['label']
    x_val = val.drop(['label'], axis=1) / 255 # normalizing the 0 - 255 scale to 0 -1
    return y_val, x_val, y_train, x_train

y_val, x_val, y_train, x_train = split_sets(train_raw_data)
```

We also want to make sure that our randomization training set shows some balance between the different classes.

```python
sns.distplot(y_val, color='red')
sns.distplot(y_train, color='green')
```

![](https://api.kauri.io:443/ipfs/QmTrWCRy9mNzmTSNQ3j4ZFkNSS69uDB2PM1FA1Roq74kMH)

Now let's preview some of the samples, what do this numbers actually look like??

```python
# Let's have a look at some random images

x_train = x_train.values.reshape(x_train.shape[0], 28, 28) # We need to reshape the images to be arranged in a square format

fig, ax = plt.subplots(1,6, figsize=(20,8))

for i in range(6):
    index = random.randint(0, len(x_train))
    ax[i].imshow(x_train[index],cmap=plt.cm.binary)
    ax[i].set_title(y_train[index], fontSize=24)
```
![](https://api.kauri.io:443/ipfs/Qmf8p1UG3KcP7ruNTopYQbFCo7HLEw1DTXhiyjsQHJsL9t)

Finally let's reshape the images yet again to prepare them for our Conv2D layers:
```python
x_train = x_train.reshape(x_train.shape[0], 28, 28, 1)
x_val = x_val.values.reshape(x_val.shape[0], 28, 28, 1)
y_train = y_train.values
y_val = y_val.values
```

Now we are ready to build and train our model!

```python
def build_model():
    model = Sequential()
    model.add(Conv2D(filters = 32, kernel_size = (5,5),padding = 'Same', activation ='relu', input_shape = (28, 28, 1)))
    model.add(Conv2D(filters = 32, kernel_size = (5,5),padding = 'Same',  activation ='relu'))
    model.add(MaxPool2D(pool_size=(2,2)))
    model.add(Dropout(0.25))

    model.add(Conv2D(filters = 64, kernel_size = (3,3),padding = 'Same', activation ='relu'))
    model.add(Conv2D(filters = 64, kernel_size = (3,3),padding = 'Same', activation ='relu'))
    model.add(MaxPool2D(pool_size=(2,2), strides=(2,2)))
    model.add(Dropout(0.25))

    model.add(Flatten())
    model.add(Dense(256, activation = "relu"))
    model.add(Dropout(0.5))
    model.add(Dense(10, activation = "softmax"))
    
    model.compile(
        optimizer='adam',
        loss=['sparse_categorical_crossentropy'],
        metrics=['accuracy']
    )
    return model

tensorboard = TensorBoard(log_dir=f"logs/{time.time()}", histogram_freq=1)

model = build_model()

history = model.fit(
    x_train,
    y_train,
    epochs=6,
    batch_size=32,
    validation_data=(
        x_val,
        y_val
    ),
    callbacks=[
        tensorboard
    ]
)
```

After a little while your model should be trained with a validation accuracy around ~99%, awesome! Let's test this on our test data:

```python
# Preparing the test data first
test_ids = test_raw_data[['id']] # we'll need this for the Kaggle submission
test_data = test_raw_data.drop(['id'], axis=1)
test_data = test_data / 255
test_data = test_data.values.reshape(test_data.shape[0], 28, 28, 1)

# Let's get the model to actually predict the labels
predictions = model.predict(test_data)

# Finally, let's render some of these images
ROWS = 6
COLUMNS = 6
fig, ax = plt.subplots(ROWS,COLUMNS, figsize=(40,40))

for row in range(ROWS):
    for column in range(COLUMNS):
        imgIndex = random.randint(0, len(test_data))
        image = test_data[imgIndex]
        image = image.reshape(28,28)
        ax[row,column].imshow(image,cmap=plt.cm.binary)
        ax[row, column].set_title(np.argmax(predictions[imgIndex]), fontSize=24)

```
