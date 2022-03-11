# HomeLab telegram bot

Telegram bot used to control my homelab server.

Set up SSL encryption with

```
cd ssl
openssl req -newkey rsa:4096 -sha256 -nodes -keyout server-key.pem -x509 -days 5000 -out server-cert.pem -subj "/C=FI/ST=Uusimaa/L=Helsinki/O=MyFancyCompany/CN=fqdn.mydomain.com"
```
