# Generate keys

```
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout nginx.key -out nginx.crt
```

or even better (replacing IP.1 with the IP of your server)

```
openssl req \
-newkey rsa:2048 \
-nodes \
-x509 \
-days 36500 -nodes \
-addext "subjectAltName = IP.1:192.168.178.29" \
-keyout nginx.key \
-out nginx.crt
```
