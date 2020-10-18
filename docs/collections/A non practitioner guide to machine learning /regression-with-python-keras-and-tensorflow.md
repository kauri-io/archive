---
title: Regression with Python, Keras and Tensorflow
summary: In this tutorial we are going to do a quick and dirty estimation of house prices based on a dataset from a Kaggle competition. Kaggle is the leading data science competition platform and provides a lot of datasets you can use to improve your skills. For simplicitys sake, we will build a simple model to get us started and we will explore how to improve it in later articles. Before we start, download the following file, which contains the training dataset, the test dataset and a sample submission
authors:
  - Davide Scalzo (@davidescalzo)
date: 2019-10-22
some_url: 
---

# Regression with Python, Keras and Tensorflow


In this tutorial we are going to do a quick and dirty estimation of house prices based on a dataset from a Kaggle competition. Kaggle is the leading data science competition platform and provides a lot of datasets you can use to improve your skills.

For simplicity's sake, we will build a simple model to get us started and we will explore how to improve it in later articles. Before we start, download the following file, which contains the training dataset, the test dataset and a sample submission (in case you want to see how your model fares in comparison to others by submitting it to the competition on Kaggle)

 [Download the dataset](https://www.kaggle.com/c/5407/download-all)

[Link to the competition](https://www.kaggle.com/c/house-prices-advanced-regression-techniques/overview)

Start your Jupyter Notebook, create and name a new kernel and let's start by importing the dependencies that we'll need.

```python
import pandas as pd
import numpy as np
import seaborn as sns
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation
print(tf.__version__)
```

Then, we need to import the dataset into our kernel, Pandas provides a handy `read_csv` method to import CSV files.
```python
raw_dataset = pd.read_csv('./train.csv', skipinitialspace=True)
test_dataset = pd.read_csv('./test.csv', skipinitialspace=True)
```

and let's visualise the first few rows of both datasets with `raw_dataset.head()` and `test_dataset.head()`
![](https://api.kauri.io:443/ipfs/QmPHmJkQDmHrS7Cs7XTUey7q74KBFG4mZbicm61FZmYKjQ)

As we can see, we have a lot of columns which we'll call features, of different types (you can run `raw_dataset.dtypes` to verify each columns data type), but for this tutorial we will focus on a small subset of features.

First let's extract our `SalePrice` column, which will be our label or dependent variable (the one we want to estimate) and display its distribution.

```python
labels = raw_dataset['SalePrice']
sns.distplot(labels)
```
![Skewed prices distribution chart](https://api.kauri.io:443/ipfs/QmZHSbHas8HmfqDgyLKrpqwHSvCj95w8DTFSuTsUu9DsnE)

The prices distribution is heavily skewed towards the left and definitely not normally distributed, while we can train a model using the labels as they are, a more normally distributed input will make training easier.

```python
labels = np.log1p(raw_dataset['SalePrice'])
sns.distplot(labels)
```
![Corrected prices distribution](https://api.kauri.io:443/ipfs/Qmb9iuLirTD9iWSPhakbJ5VuaapmeKoZDkWMscL3vJkd5L)

Much better now, let's just remember that our model will now estimate the log of the price, so we will need to convert it back by using `np.exp1()`.

We are now ready to filter out our datasets for the columns we are interested in:

```python
train_data = raw_dataset[[
    'MoSold',
    'YrSold',
    'OverallCond',
    'OverallQual',
    'LotArea',
    'YearBuilt',
    'TotalBsmtSF',
    'GrLivArea',
    'GarageCars',
    'Neighborhood'
]]
test_data = test_dataset[[
    'MoSold',
    'YrSold',
    'OverallCond',
    'OverallQual',
    'LotArea',
    'YearBuilt',
    'TotalBsmtSF',
    'GrLivArea',
    'GarageCars',
    'Neighborhood']]
train_data.head()
```
![Filtered datasets](https://api.kauri.io:443/ipfs/QmaHX4QqPXKYn1En9TgVmLmkKRQitLeDZ7C6Yn1zoRgAVu)

Much more manageable! We now have a couple of problems. First, some of the numeric columns actually represent categories, like `GarageCars` or `OverallQual`. Secondly, our model will only accept numeric data, so we will need to convert our qualitative data into numbers. Let's first convert the first set to string.

```python
train_data['MoSold'] = train_data['MoSold'].apply(str)
train_data['YrSold'] = train_data['YrSold'].apply(str)
train_data['OverallCond'] = train_data['OverallCond'].apply(str)
train_data['OverallQual'] = train_data['OverallQual'].apply(str)
## train_data['YearBuilt'].apply(str)
## train_data['GarageCars'].apply(str)
test_data['MoSold'] = test_data['MoSold'].apply(str)
test_data['YrSold'] = test_data['YrSold'].apply(str)
test_data['OverallCond'] = test_data['OverallCond'].apply(str)
test_data['OverallQual'] = test_data['OverallQual'].apply(str)
## test_data['YearBuilt'].apply(str)
## test_data['GarageCars'].apply(str)
train_data.dtypes
```

Ignore the warnings for now, as you can see we successfully migrated the columns in question are not integers anymore. For the second problems we are going to use a technique called OneHot, in which each value of a categorical column gets its own numeric column with either a 1 or a 0, depending if the columns match the original value.

```python
one_hot_train = pd.get_dummies(train_data)
one_hot_test = pd.get_dummies(test_data)
```
Finally, we will need to address the same distribution problem we had with `SalePrice`, for example, if we plot `sns.distplot(one_hot_train['GrLivArea'])` we'll see a similar skew in the distribution. To do so, we could use the log of the value as we did before, but for the inputs we can use another technique. We'll extract the stats of each column and normalize the data based on the `mean` and `std` of each column.

```python
stats = one_hot_train.describe().transpose()

def norm(x):
    return (x - stats['mean']) / stats['std']

normed_train = norm(one_hot_train)
normed_test = norm(one_hot_test)

normed_train.head()
```

Lastly we want to discard the normalized one hot columns, for a stronger input signal.

```python
input_train = one_hot_train
input_train['LotArea'] = normed_train['LotArea']
input_train['TotalBsmtSF'] = normed_train['TotalBsmtSF']
input_train['GrLivArea'] = normed_train['GrLivArea']
input_train['GarageCars'] = normed_train['GarageCars']
input_train['YearBuilt'] = normed_train['YearBuilt']
input_test = one_hot_test
input_test['LotArea'] = normed_test['LotArea']
input_test['TotalBsmtSF'] = normed_test['TotalBsmtSF']
input_test['GrLivArea'] = normed_test['GrLivArea']
input_test['GarageCars'] = normed_test['GarageCars']
input_test['YearBuilt'] = normed_test['YearBuilt']
```

Our final input data should look like this:
![Final input data](https://api.kauri.io:443/ipfs/QmR3J77skdWhmcDU6pGGsMK8WV3W2GyQZt7hNuXWe2Qgcp)

And let's save these datapoints to a pickle file, so we don't need to do all of this in case we want to reuse this data.

```python
import pickle
pickle_out = open(f"{ITERATION}labels.pickle","wb")
pickle.dump(labels, pickle_out)
pickle_out.close()

pickle_out = open(f"{ITERATION}input_train.pickle","wb")
pickle.dump(input_train, pickle_out)
pickle_out.close()

pickle_out = open(f"{ITERATION}input_test.pickle","wb")
pickle.dump(input_test, pickle_out)
pickle_out.close()
```
You can later access the data using
```python
import pickle
pickle_in = open("../input/house-prices-pickles-1/1.labels.pickle","rb")
labels = pickle.load(pickle_in)
```


Time to build our model and train it!

```python
model = Sequential()

model.add(Dense(32, input_shape=input_train.shape[1:]))
model.add(Activation('sigmoid'))
model.add(Dense(1))
model.add(Activation('relu'))

model.compile(
    loss='mean_squared_error',
    optimizer='adam',
    metrics=['mean_squared_error','mean_absolute_error']
)

model.fit(
    input_train,
    labels,
    batch_size=32,
    epochs=30,
    validation_split=0.1,
    verbose=1
)
```
For each Epoch, you'll see some stats, as we did input the log of the price we'll want to focus on the `mean_absolute_error`. After 30 epochs, it will be around `0.135`, that means that for each prediction we should be in the range of ±0.135 from the log of the price in question. For a $500,000 we could calculate it like so:

```python
logged_price = np.log(500000) # 13.122363377404328
lower_boundary = np.exp(logged_price - 0.135) # 436857.95584401704
upper_boundary = np.exp(logged_price + 0.135) # 572268.3921756567 
```

That's around 13% off, not perfect, but not bad either. The score is calculated on a small subset of the input data which we have defined with our `validation_split` parameter.

It is now time to generate some results on our test_dataset!

```python
predictions = np.exp(model.predict(input_test))
sns.distplot(predictions)
```
Unfortunately, we won't be able to render the chart, as our model wasn't able to estimate a few values, a reasonable approach, for now would be to just replace them with the mean of the dataset.

```python
predictions = np.exp(model.predict(input_test))
test_dataset['SalePrice'] = predictions
results = test_dataset[['Id','SalePrice']]
results = results.fillna(np.exp(labels.describe()['mean']))
results.isna().sum()
results.head()
```

and finally let's render the two distribution plots for a quick eye check on how our model works :)

```python
sns.distplot(results['SalePrice'])
sns.distplot(np.exp(labels))
```

![Fully rendered model](https://api.kauri.io:443/ipfs/QmXMJ8MquB61jor9Y6G4WyLWmQJudE719ndWVMgBaNUrK1)

That's it! You've built your first models for estimating the price of real estate property! This model clearly needs some work but we'll cover it in the following articles. If you want to get ahead, try tweaking some of the parameters, like increasing the number of Epochs, pre-processing the data a bit differently or the structure of the models and see if you can improve the model yourself.

Also feel free to join the competition on Kaggle and see how your model fairs against fellow data nerds!
If you have any question or spot any error please feel free to comment or submit and update to this article :)








