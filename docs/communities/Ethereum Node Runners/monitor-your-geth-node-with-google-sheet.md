---
title: Monitor your Geth node with Google Sheet
summary: In this article, I will explain how to monitor a Geth node and keep track of the syncing process very easily with a CronJob and Google Sheet Capture and store g
authors:
  - Grégoire Jeanmart (@gregjeanmart)
date: 2020-05-03
some_url: 
---

# Monitor your Geth node with Google Sheet

![](https://ipfs.infura.io/ipfs/QmdTDdL7AmkJNw2aM7hP5dUNbLMt3Y34iZFovbgkRdJ2Hk)


In this article, I will explain how to monitor a Geth node and keep track of the syncing process very easily with a **CronJob** and **Google Sheet**

<br />

### Capture and store geth and system metrics every 15 min

In the first step, we are configuring a cronjob (15 min scheduled task) on our Linux system where Geth is installed to capture some interesting metrics about the syncing state of Geth (blocks, states, peers) and the operating system (e.g CPU, memory, disk, load average).

Use the command `$ crontab -e` to edit the crontab file and add the following line at the end to capture all the metrics and print them into a semi-column seperated CSV file.

```shell
$ crontab -e

*/15 * * * * echo $(date --iso-8601=seconds)\;$(/usr/local/bin/geth --verbosity 0 --datadir /mnt/ssd/ethereum/ --exec 'var a = admin.peers; var s = eth.syncing; s.currentBlock + ";" + s.highestBlock + ";" + (s.highestBlock-s.currentBlock) + ";" + s.pulledStates + ";" + s.knownStates + ";" + a.length' attach | tr -d "\"")\;$(df /dev/sda --output=used | sed -n 2p)\;$(iostat /dev/sda -d -x | awk {'print $4";"$5";"$16'} | sed -n 4p)\;$(free | awk {'print $3";"$2'} | sed -n 2p)\;$(free | awk {'print $3";"$2'} | sed -n 3p)\;$(cat /proc/loadavg | awk {'print $1";"$2";"$3'})\;$(iostat -c | sed -n 4p | awk {'print $1'})\;$(cat /sys/devices/virtual/thermal/thermal_zone?/temp | sed -n 1p | awk '{ print $1/1000 }') >> /home/pi/geth_metrics.csv
```

Please find below a detailed explanation of each metrics:

- `date --iso-8601=seconds` prints the current date and time
- `/usr/local/bin/geth --verbosity 0 --datadir /mnt/ssd/ethereum/ --exec 'var a = admin.peers; var s = eth.syncing; s.currentBlock + ";" + s.highestBlock + ";" + (s.highestBlock-s.currentBlock) + ";" + s.pulledStates + ";" + s.knownStates + ";" + a.length' attach | tr -d "\""` connects to geth (**`--datadir` might differ**) and retrieve the following information: number of peers connected, current block, highest block, pulled states count, known states counts
- `df /dev/sda --output=used | sed -n 2p` prints the used disk space
- `iostat /dev/sda -d -x | awk {'print $4";"$5";"$16'} | sed -n 4p` returns the current disk speed (read/write) as well as the percentage utilization of the disk
- `free | awk {'print $3";"$2'} | sed -n 2p` prints the used and total memory of the system
- `free | awk {'print $3";"$2'} | sed -n 3p` prints the used and total swap of the system
- `cat /proc/loadavg | awk {'print $1";"$2";"$3'}` returns the current load average (1min, 5min, 15min)
- `iostat -c | sed -n 4p | awk {'print $1'}` prints the current CPU percentage utilization
- `cat /sys/devices/virtual/thermal/thermal_zone?/temp | sed -n 1p | awk '{ print $1/1000 }'` gives the CPU temperature`


*You can replace `/home/pi/geth_metrics.csv` by any files on the system.*

<br />

As a result, every 15 min, the CSV file will be appended with new metrics.

```
$ cat /home/pi/geth_metrics.csv

2019-07-18T21:26:35+00:00;101961;8177084;8075123;161917;180980;2;253504;0.62;117.12;0.04;778208;3902632;0;1048572;0.38;1.00;1.19;12.67;73.333
2019-07-18T21:30:01+00:00;159477;8177085;8017608;275001;278183;1;268872;0.56;202.80;0.07;1044764;3902632;0;1048572;0.60;0.84;1.08;12.24;73.888
2019-07-18T21:33:33+00:00;250481;8177085;7926604;428601;433461;2;349988;0.52;371.21;0.15;1116412;3902632;0;1048572;1.71;1.09;1.12;12.35;81.111
2019-07-18T21:45:01+00:00;627247;8177085;7549838;968580;984164;2;770176;0.44;1158.09;1.05;1392844;3902632;0;1048572;1.57;1.56;1.38;13.72;81.111
2019-07-18T22:00:01+00:00;1082609;8130757;7048148;1426403;1435807;4;1591660;0.58;2266.40;9.37;1924360;3902632;94180;1048572;4.52;3.60;2.46;16.52;85
2019-07-18T22:15:01+00:00;1567205;8130757;6563552;2057942;2073322;4;2634280;53.69;3269.29;17.25;1933836;3902632;88048;1048572;5.23;4.92;3.96;21.52;85
2019-07-18T22:30:01+00:00;1989925;8130757;6140832;2483400;2495245;5;3853104;136.76;3859.22;24.92;2338120;3902632;93864;1048572;5.22;5.23;4.79;24.50;85
2019-07-18T22:45:01+00:00;2299173;8130757;5831584;2920692;2929477;4;5301752;361.05;4269.15;30.82;2176872;3902632;119088;1048572;2.85;4.18;4.56;25.60;86.25
2019-07-18T23:15:01+00:00;2906725;8177462;5270737;4027097;4044446;5;6535608;657.72;4665.52;40.31;2398636;3902632;150656;1048572;5.69;5.09;4.78;26.53;84.444
2019-07-18T23:30:01+00:00;3159185;8177462;5018277;4536810;4546514;5;7505728;828.10;4816.98;44.13;2413820;3902632;163456;1048572;6.61;5.24;4.80;26.54;85.625
2019-07-18T23:45:01+00:00;3361105;8177462;4816357;5048547;5067699;5;8213208;1028.79;4985.85;46.91;2571084;3902632;311896;1048572;6.79;5.02;4.68;26.51;83.333
2019-07-19T00:00:01+00:00;3477846;8177462;4699616;5342584;5357046;7;8652872;1163.52;5077.63;49.44;2612572;3902632;245560;1048572;2.26;2.69;3.72;26.00;83.888
2019-07-19T00:15:01+00:00;3653603;8177462;4523859;5552829;5563140;6;9690200;1247.86;5207.35;51.82;2619068;3902632;152392;1048572;1.32;2.95;3.94;25.91;80.555
2019-07-19T00:30:02+00:00;3739227;8177462;4438235;5654646;5667718;8;10495560;1344.81;5289.54;53.96;2725264;3902632;150148;1048572;6.14;4.95;4.02;25.23;77.5
2019-07-19T00:45:01+00:00;3765126;8177462;4412336;5702220;5717080;11;11417168;1435.85;5333.76;55.48;1745124;3902632;153204;1048572;1.78;1.79;2.75;24.23;73.888
2019-07-19T01:00:02+00:00;3843678;8177462;4333784;5820804;5890068;9;11633704;1523.96;5406.01;57.08;2412956;3902632;164576;1048572;1.41;2.65;3.18;23.96;80.555
2019-07-19T01:15:01+00:00;3888203;8177462;4289259;6108650;6136919;11;12499780;1624.54;5543.22;57.88;2689468;3902632;163144;1048572;5.75;4.31;3.36;23.63;83.888
2019-07-19T01:30:01+00:00;3916105;8177462;4261357;6241422;6258778;12;12976984;1742.07;5643.39;58.81;2853616;3902632;165184;1048572;5.34;3.03;2.83;23.01;85
```


<br />

### Render the data into a spreadsheet

Now we have a consistent way to capture periodically our Geth and system metrics into a CSV, we can download this file and upload it to a Google Spreadsheet template.

1. Download the CSV file

Connect via SSH using SCP to download the CSV file.

```shell
$ scp user@xx.xx.xx.xx:/home/pi/geth_metrics.csv ~/Downloads/geth_metrics.csv
```

2. Create a copy of the spreadsheet template

Open the [template](https://docs.google.com/spreadsheets/d/1lxJ5_v3ozJ7YbN1JlglYvF7x8ssRsPLOrxSIX-obvow/edit?usp=sharing) and create a copy

![](https://i.imgur.com/TVu2khM.png)

3. Import the CSV data into the `raw` sheet

- Select the tab sheet called `raw`
- Click on *File > Import*
- Go to the *Upload* tab
- Select the file `geth_metrics.csv` downloaded
- In the popup
    - Import location: Replace current sheet
    - Separator type: custom `;`

![](https://i.imgur.com/JfNlSeo.png)

- Click on "Import Data"

4. Once imported, you should be able to navigate to the "Table" sheet and visualise every single metrics over time

![](https://i.imgur.com/Iqsa7dS.png)

In the "Charts" sheet, you can visualise diagrams for each metrics

![](https://i.imgur.com/bEyHJAV.png)


**Replay those steps every time you want to update the Geth metrics dashboard**  

<br />

### Congrats

You can now:

- Track precisely the performance of your Geth node
- Observe the system health, investigate unusual behaviour and find the root cause of a problem
- Shill on Twitter your nice diagrams rather than dirty system logs 


---

- **Kauri original link:** https://kauri.io/monitor-your-geth-node-with-google-sheet/5ab5c4d558e04a73accebc652ef2246b/a
- **Kauri original author:** Grégoire Jeanmart (@gregjeanmart)
- **Kauri original Publication date:** 2020-05-03
- **Kauri original tags:** ethereum, geth, sheet, monitoring, cronjob
- **Kauri original hash:** QmYU9ZXxziht9pnLhFyRhzfkzf4tD1GmMEGCBaHtXX55id
- **Kauri original checkpoint:** unknown



