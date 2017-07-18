FROM node
RUN mkdir /app
WORKDIR /app
COPY . /app
EXPOSE  8000
RUN [ "npm", "install", "yarn", "-g" ]
RUN [ "rm", "-rf", "node_modules" ]
RUN [ "yarn" ]
CMD [ "npm", "run", "s"]