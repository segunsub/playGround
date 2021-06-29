FROM node:16-alpine 

# Base Image
EXPOSE 5000
#port
WORKDIR /app
#working directory
COPY . .
#copying files
RUN npm install

USER node

ENTRYPOINT ["./start.sh"]
