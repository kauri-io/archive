---
title: Getting started with Caddy 2
summary: I write a lot of small projects in Go. Many of them have web interfaces and most of them share servers. Being a cautious kind of fellow, I am reluctant to put m
authors:
  - Dave Appleton (@daveappleton)
date: 2020-06-25
some_url: 
---

# Getting started with Caddy 2


I write a lot of small projects in Go. Many of them have web interfaces and most of them share servers.

Being a cautious kind of fellow, I am reluctant to put my Go web interfaces directly facing the internet and anyway that would require a lot of port management so discovering reverse proxies came as good news but I never really took the time to master NGINX or Lighttpd because I found the configuration non intuitive and certificate management was a pain.

The pain was greatly relieved when I discovered Caddy. Caddy is a versatile little web server written in Go my favourite language.

Among its many claims to fame are its speed, ease of configuration, automatic certificate handling and the many other features that are built into it. Since it was released it has slowly been eating into the space occupied by the other better known light servers.

Hidden in that line was **automatic certificate handling** meaning that it will install a LetsEncrypt ssh certificate for you and continuously ensure that it is kept up to date.

With Caddy 2 approaching final release and a little bit of time on my hands and a project that needed a reverse proxy I thought it was time to give Caddy 2 a spin.

This is the story of my first day testing caddy version 2 facilitated by the [online docs](https://caddyserver.com/docs/) and [online community forum](https://caddy.community/)

**Building a linux executable on a mac**

The Caddy website can be found at https://caddyserver.com/ there you can read a load of documentation and join the caddy community to get help from the community.

The downloads section lists pre-compiles for Fedora, RedHat and CentOS. They also have a docker image and a Digital Ocean droplet. 
Since I run a mac and Ubuntu, I elected to clone the repo and build it myself.

As long as you have Go 1.14 installed it is effortless and fast to build an image. Since I planned to deploy from my mac to an Amazon instance I elected to cross compile it.

Cross compiling from Go is a breeze :

```bash
git clone "https://github.com/caddyserver/caddy.git"
GOOS=linux GOARCH=386 go build
```

A really short time afterwards you have a new linux executable waiting for you.

**Installing on Amazon**

Next I fired up an Amazon LightSail instance and copied my public key to it to allow me to log in and transfer files using scp.

Also **VERY IMPORTANT** I opened up port 443

Finally I copied the cross compiled instance of caddy to the server.

I then followed the [documentation verbatim](https://caddyserver.com/docs/install) to get everything into the correct place

```bash
$ sudo mv caddy /usr/bin/
$ sudo groupadd --system caddy
$ sudo useradd --system \
	--gid caddy \
	--create-home \
	--home-dir /var/lib/caddy \
	--shell /usr/sbin/nologin \
	--comment "Caddy web server" \
	caddy
```

Then I took the supplied system service file to save to `/etc/systemd/system/caddy.service` and created my first extremely basic Caddyfile in `/etc/caddy` 

**Obviously** you need to replace `example.com` with a domain that you actually control.

```text
www.example.com

respond "Hello World :-)"
```

which defines which site is being served and the fact that the reply to every page is "Hello World :-)" to every request.

finally, to set caddy up as a service (also from the first page of docs)

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl enable caddy
$ sudo systemctl start caddy
```

As soon as Caddy starts it will download a Letsencrypt SSH certificate and install it.

The only thing is, your domain does not point to the server. I chose to use Cloudflare to act as my DNS server. If you do this, do not let Cloudflare act as your proxy.

You can test it from any web browser by typing your domain (e.g. `https://www.example.com`) in the address bar

![](https://ipfs.infura.io/ipfs/QmdQB4T1QLqBPnURtGVYWXagYudzwK4PtB1SSEToEnL9PN)

** Really simple file server **

if you want a quick & dirty setup - have a look at the options for the [static file server](https://caddyserver.com/docs/quick-starts/static-files)

stop the service, navigate to the folder with the files and run

```text
$ caddy file-server
```

**A simple file server using the Caddyfile**

You can configure caddy as a simple file server by simply changing the Caddyfile to 

```text
www.example.com

root * /home/dave/www
file_server
```

This is easy to test - simply put HTML files in the www folder and you are ready to go.

** Reverse proxies **

As mentioned above, my chief reason for looking at Caddy is because I write a lot of small independent services which share a server for the sake of efficiency and would like to get rid of the pain of port management.


** Really simple reverse proxy server **

The quick and dirty version can be found in the [proxy server setup](https://caddyserver.com/docs/quick-starts/reverse-proxy)

examples from the documentation :

```text
& caddy reverse-proxy --to 127.0.0.1:9000
```

```text
$ caddy reverse-proxy --from :2016 --to 127.0.0.1:9000
```

** Getting a reverse proxy working from the Caddyfile for more flexibility **


I created a simple web server just for testing [source code here](https://gist.github.com/DaveAppleton/124f23cf276ed1251a886df6f23e63ca)

this server accepts requests on port 8001

Let's get it working on the local machine first. 



Start with this Caddyfile.

In this case, you can start caddy by using `$ caddy run` which allows you to stop the server using CTRL-C

note : Not defining a domain allows us to avoid having it load a certificate which is pointless on your local machine

```text
:2020

reverse_proxy localhost:8001
```

starting both the server and caddy you can now access your server on both ports 8001 and on 2020

![](https://ipfs.infura.io/ipfs/QmZ5dS3ZiqB9DP6BbSaoRT48gpDqT5HQbGEk6feWQNcZFp)

![](https://ipfs.infura.io/ipfs/QmaMLGzN7Fa9Vpv6uSpVPjUYAA9uuxnwrfNemnj5QUpGvq)

You can also query the admin interface on port 2019

![](https://ipfs.infura.io/ipfs/QmaxP6jxuCnGx3mwSuJMLnJe54eTKPXfTxPK5LT9Q2nDE9)

**Mix and Match **

You can add, for example, a static file server on all interfaces that do not start with `/api/`

```text
:2020

reverse_proxy /api/* localhost:8001
file_server
```

Test this by having a simple index.html in the folder that you start caddy and visiting 

your reverse proxy at 

localhost:2020/api/time

and your index file at

localhost:2020

** Now for the Amazon server **

Because caddy is running as a service, your Caddyfile is going to be stored in `/etc/caddy` you need to specify the file root as in the earlier example.

```text
www.example.com

reverse_proxy /api/* localhost:8001
root * /lib/caddy
file_server
```

Now you need to reload your Caddyfile

`sudo systemctl reload caddy`

then check the status

`systemctl status caddy.service`

Next copy an index.html file to /lib/caddy and check that it has been served correctly

** Checking the reverse proxy **

Recompile the test server for linux 

`GOOS=linux  GOARCH=386 go build -o server.linux`

transfer it to your server using scp and run it.

Now you should be able to call `www.example.com/api/test` and `www.example.com/api/time` from your browser.

** conclusion & notes from day 1 **

Caddy 2 is still in final testing. The documentation (hence everything above) is still subject to change. 

That being said, it is refreshing to have something so easy to install and use.

Compiling is fast and easy, configuration is equally simple. It is not just that the documents are correct, the processes are simple which makes it easy to get right.

There is a lot of power under the hood that I have not even tried yet - from the full power of Caddy files and using the API through to templates and extension modules.

I know I will get there soon but no promised deadlines.




---

- **Kauri original title:** Getting started with Caddy 2
- **Kauri original link:** https://kauri.io/getting-started-with-caddy-2/6391aa56db3143ab989590f060f722a8/a
- **Kauri original author:** Dave Appleton (@daveappleton)
- **Kauri original Publication date:** 2020-06-25
- **Kauri original tags:** reverse-proxy, caddy, web-server
- **Kauri original hash:** QmPFTeaN7gh6Rzwyu6SSqrn47MUGxFyR9nL87An6VW9CPy
- **Kauri original checkpoint:** unknown



