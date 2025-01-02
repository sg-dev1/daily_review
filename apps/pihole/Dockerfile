# Based on https://github.com/klutchell/balena-pihole/blob/main/pihole/Dockerfile
FROM pihole/pihole:2024.07.0 
#FROM pihole/pihole:latest

#RUN sed -i '/$AUTHORIZED_HOSTNAMES = array(/ a "balena-devices.com",' /var/www/html/admin/scripts/pi-hole/php/auth.php

# https://serverfault.com/a/817791
# force dnsmasq to bind only the interfaces it is listening on
# otherwise dnsmasq will fail to start since balena is using 53 on some interfaces
#RUN echo "bind-interfaces" >> /etc/dnsmasq.conf

COPY apps/pihole/cont-init.d/ /etc/cont-init.d/
RUN chmod +x /etc/cont-init.d/10-custom.sh 

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
