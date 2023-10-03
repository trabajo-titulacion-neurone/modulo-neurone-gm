FROM node:12

RUN mkdir -p /usr/src/server-neuronegm
# Create app directory
WORKDIR /usr/src/server-neuronegm
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 3080
CMD [ "npm", "start" ]