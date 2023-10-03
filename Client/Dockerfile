# This defines our starting point
FROM node:10

# Working directory
RUN mkdir /usr/src/client-neuronegm
# Create app directory
WORKDIR /usr/src/client-neuronegm

COPY . .

EXPOSE 4200

# Dependencies
RUN npm install -g @angular/cli@10.0.0
RUN npm install

# Serve the app
CMD ["npm", "start"]