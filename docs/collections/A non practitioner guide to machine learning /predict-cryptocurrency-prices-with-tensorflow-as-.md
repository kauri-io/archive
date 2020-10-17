---
title: Predict cryptocurrency prices with Tensorflow as binary classification problem
summary: Introduction In this tutorial well go through the prototype for a neural network which will allow us to estimate cryptocurrency prices in the future, as a binary classification problem, using Keras and Tensorflow as the our main clarvoyance tools. While it is most likely not the best way to approach the problem (after all investment banks invest billions in developing such algorithms), if we can get it right more than 55% of the times, we are in the money! What well be doing Download data using
authors:
  - Davide Scalzo (@davidescalzo)
date: 2019-10-22
some_url: 
---

# Predict cryptocurrency prices with Tensorflow as binary classification problem

## Introduction
In this tutorial we'll go through the prototype for a neural network which will allow us to estimate cryptocurrency prices in the future, as a binary classification problem, using Keras and Tensorflow as the  our main clarvoyance tools.

While it is most likely not the best way to approach the problem (after all investment banks invest billions in developing such algorithms), if we can get it right more than 55% of the times, we are in the money!

## What we'll be doing
- Download data using Binance API
- Preprocess the data
- Train our model(s)
- Feature engineering
- Evaluate best performing models

## Downloading data using Binance API
for this example we'll download the maximum amount of data that can be fetched in a single call. If you want to train a better more and use it in the real world (which is not recommended by the way, you will likely loose real money), I would suggest to gather more data using multiple calls.

```python
import requests
import json
import pandas as pd
import datetime as dt

START_DATE = '2019-01-01'
END_DATE = '2019-10-01'
INTERVAL = '15m'

def parse_date(x):
    return str(int(dt.datetime.fromisoformat(x).timestamp()))

def get_bars(symbol, interval):
    root_url = 'https://api.binance.com/api/v1/klines'
    url = root_url + '?symbol=' + symbol + '&interval=' + interval + '&startTime=' + parse_date(START_DATE) + '&limit=1000'
    data = json.loads(requests.get(url).text)
    df = pd.DataFrame(data)
    df.columns = ['open_time',
                  'o', 'h', 'l', 'c', 'v',
                  'close_time', 'qav', 'num_trades',
                  'taker_base_vol', 'taker_quote_vol', 'ignore']
    df.drop(['ignore', 'close_time'], axis=1, inplace=True)
    return df

ethusdt = get_bars('ETHUSDT', INTERVAL)
ethusdt.to_csv('./data.csv', index=False)
```

In this simple piece of code we are requiring the necessary packages, setup a couple of parameters (I picked a 15 minutes interval but you can pick more granular interval for higher frequency trading) and setup a couple of convenience functions, then save the data to csv for future reuse. This should be self explanatory but if something confuses you, please feel free to leave a comment asking for clarifications :)

## Preprocessing the data

As prices overtime is a form of sequential data we are going to use a LSTM layer (Long-short-term-memory) as the first layer in our net. We want to provide data as a sequence of events, which will predict the price at time `t+n` where `t` is the current time and `n` defines how far in the future we want to predict, to do so we'll feed data as a time window  of `w` length. It will all be clearer once we look at the code, let's start importing the required packages.

```python
import pandas as pd
import numpy as np
import seaborn as sns
import random
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.callbacks import TensorBoard
import time
import matplotlib.pyplot as plt
```

This will import Pandas, Numpy, all the Tensorflow functions we need to train our model and a couple of other useful packages.

Next, we want to define some constants, and load our data from csv (in case you are writing the training code on a different file:

```python
WINDOW = 10 # how many time units we are going to use to evaluate the future value, in our case each time unit is 15 minutes so we are going to look at 15 * 10 = 150 minutes trading data
LOOKAHEAD = 5 # how far ahead we want to estimate if the future prices is going to be higher or lower? In this case is 5 * 15 = 75 minutes in the future
VALIDATION_SAMPLES = 100 # We want to validate our model on data that wasn't used for the training, we are establishing how many data point we are going to use here.

data = pd.read_csv('./data.csv')
data['future_value'] = data['c'].shift(-LOOKAHEAD) # This allows us to define a new column future_value with as the value of c 5 time units in the future
data.drop([
    'open_time'
], axis=1, inplace=True) # we don't care about the timestamp for predicting future prices
```

Let's define a function that allows us to define if the future value is higher or lower than the current close price:
```python
def define_output(last, future):
    if future > last:
        return 1
    else:
        return 0
```
Simply set the target as 0 if the price is lower or equal than the current close and 1 if it is higher.
Now let's define a function that allows us to create the moving time windows we need  to feed to our neural network:

```python
def sequelize(x):
    data = x.copy()
    buys = []
    sells = []
    holds = []
    data_length = len(data)
    for index, row in data.iterrows():
        if index <= data_length - WINDOW:
            last_index = index + WINDOW -1
            rowset = data[index : index + WINDOW]
            row_stats = rowset.describe().transpose()
            last_close = rowset['c'][last_index]
            future_close = rowset['future_value'][last_index]
            rowset = 2 * (rowset - row_stats['min'])  / (row_stats['max'] - row_stats['min']) - 1
            rowset.drop(['future_value'], axis=1, inplace=True)
            rowset.fillna(0, inplace=True)
            category = define_output(last_close, future_close)
            if category == 1:
                buys.append([rowset, category])
            elif category == 0:
                sells.append([rowset, category])
    min_len = min(len(sells), len(buys))
    results = sells[:min_len] + buys[:min_len]
    return results

sequences = sequelize(data)
```
Oh ok, that's a lot of stuff going on there. Let's look at it bit by bit:

```python
    data = x.copy() # let's copy the dataframe, just in case
    buys = []
    sells = []
    holds = []
    data_length = len(data)
```

Here we are doing some preliminary stuff, copy the dataframe to ensure we don't override it (it can be annoying if you are using Jupyter Notebook for example) and setting up arrays for buys and sells, which we'll use to balance our data.

```python
    for index, row in data.iterrows():
        if index <= data_length - WINDOW:
            last_index = index + WINDOW -1
            rowset = data[index : index + WINDOW]
```
As we iterate each row in the dataset if the index is greater than our defined window size, we can create a new slice of the dataset that is the size of our window size. Before we store this data in another array we need to normalize it with the following code:

```python
row_stats = rowset.describe().transpose()
last_close = rowset['c'][last_index]
future_close = rowset['future_value'][last_index] # we'll need to save this separately from the rest of the data
rowset = 2 * (rowset - row_stats['min'])  / (row_stats['max'] - row_stats['min']) - 1
```

And we also want to remove the future_value from our dataset as well as replacing any possible NaN with 0s (not ideal good enough for our purpose):

```python
rowset.drop(['future_value'], axis=1, inplace=True)
rowset.fillna(0, inplace=True)
```

Finally we want to ensure that our sells and buys are balanced, if one occurs more often than the other, our network will quickly get biased toward the skew and not provide us with reliable estimations:

```python
            if category == 1:
                buys.append([rowset, category])
            elif category == 0:
                sells.append([rowset, category])
    # the following 2 lines will ensure that we have an equal amount of buys and sells
    min_len = min(len(sells), len(buys))
    results = sells[:min_len] + buys[:min_len]
    return results
```

Finally we run this function on our data `sequences = sequelize(data)`

It's also a good idea to randomize our data, so that our model is not influenced by the precise order our dataset is sorted by, the following code will randomize the dataset, split training vs testing dataset and displaying the distribution of buys vs sells in both datasets. Feel free to rerun this snippet to ensure a more balanced distribution of buys and sells:

```python
random.shuffle(sequences)
def split_label_and_data(x):
    length = len(x)
    data_shape = x[0][0].shape
    data = np.zeros(shape=(len(x),data_shape[0],data_shape[1]))
    labels = np.zeros(shape=(length,))
    for index in range(len(x)):
        labels[index] = x[index][1]
        data[index] = x[index][0]
    return data, labels
x_train, y_train = split_label_and_data(sequences[: -VALIDATION_SAMPLES])
x_test, y_test = split_label_and_data(sequences[-VALIDATION_SAMPLES :])
sns.distplot(y_test)
sns.distplot(y_train)
len(y_train)
```

![Dataset result](https://api.kauri.io:443/ipfs/QmRwCWoLMrUkRxuQHAaJohdAXsFAz3ay23gd6mxRgdqSA2)

After running the snippet a couple of time, you should get something like this, with an even split of buys and sells (left vs right) across both datasets.


## Training the model(s)

We are now ready to train the model, but as we have yet to explore what hyper-parameters work best with our model and data we'll try a slightly more complex approach. First let's define four hyper-parameters arrays:

```python
DROPOUTS = [
    0.1,
    0.2,
]
HIDDENS = [
    32,
    64,
    128
]
OPTIMIZERS = [
    'rmsprop',
    'adam'
]
LOSSES = [
    'mse',
    'binary_crossentropy'
]
```

Then we'll iterate through each array to train a model with that combinations of hyper parameters, so that we can later compare them using TensorBoard:

```python
for DROPOUT in DROPOUTS:
    for HIDDEN in HIDDENS:
        for OPTIMIZER in OPTIMIZERS:
            for LOSS in LOSSES:
                train_model(DROPOUT, HIDDEN, OPTIMIZER, LOSS)
```

Now we need to define the `train_model` function that will actually create and train the model:

```python
def train_model(DROPOUT, HIDDEN, OPTIMIZER, LOSS):
    NAME = f"{HIDDEN} - Dropout {DROPOUT} - Optimizer {OPTIMIZER} - Loss {LOSS} - {int(time.time())}"
    tensorboard = TensorBoard(log_dir=f"logs/{NAME}", histogram_freq=1)

    model = Sequential([
        LSTM(HIDDEN, activation='relu', input_shape=x_train[0].shape),
        Dropout(DROPOUT),
        Dense(HIDDEN, activation='relu'),
        Dropout(DROPOUT),
        Dense(1, activation='sigmoid')
    ])
    model.compile(
        optimizer=OPTIMIZER,
        loss=LOSS,
        metrics=['accuracy']
    )
    model.fit(
        x_train,
        y_train,
        epochs=60,
        batch_size=64,
        verbose=1,
        validation_data=(x_test, y_test),
        callbacks=[
            tensorboard
        ]
    )
```

For now this is a very simple model with an LSTM layer as the first layer, one Dense intermediate layer and one Dense output layer of size 1 and `sigmoid` activation. This layer will output the probability (ranging from 0 to 1) that a specific sequence of size `WINDOW` will be followed by a higher closing price after `LOOKAHEAD` intervals, where 0 is a high probability of a lower closing price and 1 is a high probability of a higher closing price.

We are also adding a Tensorboard callback, which will allow us to see how each model performs over each training cycle (EPOCH)

Feel free to run this code and then run Tensorboard, in your terminal `tensorboard --logdir=logs`

## Feature engineering
The best model should have an accuracy on the validation data that is higher than 60%, which is already quite good. However, we can improve our model very quickly by extracting more data from our existing data set. The process of extracting new features from existing features is called `Feature Engineering`. Examples of feature engineering would be extracting a weekend boolean column from a data, or a country from a coordinates pair. In our case we are going to add technical analysis data to our OHLC dataset.

At the top of your notebook or file, add the `ta` package: `from ta import *`.

Just after loading the data from csv, add the following line, which will append TA data to our existing dataset in the form of new columns
```python
data = pd.read_csv('./data.csv')
#add the following line
add_all_ta_features(data, "o", "h", "l", "c", "v", fillna=True) 
data['future_value'] = data['c'].shift(-LOOKAHEAD)
```

That's it, in a few line we have massively enriched our dataset. We can now run the model generator loop to figure out how our models perform with the new dataset, this will take quite a bit longer, but should be worth the wait.

![](https://api.kauri.io:443/ipfs/QmdvN4dQGfGqdhDxuaQWg7kzEvtneccnDrjUcTFa8XwYJY)

A richer, more meaningful dataset should ensure a more accurate model, and in the image above, we can clearly see how the richer dataset perform better than the simple data-set, with a validation accuracy hovering around the 80% mark!

## Evaluating the best performing models.
Now that we have some models that seem to perform nicely on paper, how do we evaluate which one should be used in an hypothetical trading system?

This can be quite subjective, but in my opinion a good approach would be to separately looks at the buys and sells from the known validation labels and plot the distribution of the corresponding predictions. Hopefully, for all the buys, our model mostly predicts buys and not many sells and viceversa.

Let's define a function that displays such chart for each model:
```python
def display_results(NAME, y_test, predictions):
    plt.figure()
    buys = []
    sells = []
    for index in range(len(y_test)):
        if y_test[index] == 0:
            sells.append(predictions[index])
        elif y_test[index] == 1:
            buys.append(predictions[index])
    sns.distplot(buys, bins=10, color='green').set_title(NAME)
    sns.distplot(sells, bins=10, color='red')
    plt.show()
```

and let's now call this function every time we finish training on a model:
```python
    model.fit(
        x_train,
        y_train,
        epochs=60,
        batch_size=64,
        verbose=0,
        validation_data=(x_test, y_test),
        callbacks=[
            tensorboard
        ]
    )
    # after the model.fit call, add the following 2 lines.
    predictions = model.predict(x_test)
    display_results(NAME, y_test, predictions)
```

As the different models train we should now see images similar to the below, where the buys are plotted in green (and we want them on the right end side, clustered around the 1 value) and the sells are plotted in red (clustered around the 0 values on the left). These should help us decide which model provides a more reliable estimation of future prices.

![](https://api.kauri.io:443/ipfs/QmWJ4Zjwiwi5814oKRi7FF8tgEWQRXfC92FYGneX9qydmc)


And that's it, we now have a few prototypes to play with that provide a decent estimation of future prices.
As an exercise for yourself try the following:
- What happens if you increase the number of hidden layers of the network? 
- What happens if your datasets is unbalanced?
- What happens if you increase the DROPOUT value?
- What happens if you test your best model on new data? (e.g. by fetching a different timestamp from Binance?

If you have any question or suggestion, please feel free to comment below or suggest an update to this article :)