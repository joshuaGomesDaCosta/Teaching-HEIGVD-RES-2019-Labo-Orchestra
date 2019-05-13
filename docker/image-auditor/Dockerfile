FROM node:4.3.1
MAINTAINER Vincent Guidoux <vincent.guidoux1@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app/
RUN ["npm","install","moment","--save"]

ENTRYPOINT ["node", "/opt/app/Auditor.js"]