ssh-keygen -t rsa -b 4096 -m PEM -f jwt-private-key.key
openssl rsa -in jwt-private-key.key -pubout -outform PEM -out jwt-public-key.pub
