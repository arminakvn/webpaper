FROM node:argon
ADD package.json /usr/src/app/package.json
ADD package.json npm-shrinkwrap.json* /usr/src/app/
WORKDIR /usr/src/app
RUN npm --unsafe-perm install
ADD app.js /usr/src/app/app.js
EXPOSE 8080
CMD [ "npm", "start" ]