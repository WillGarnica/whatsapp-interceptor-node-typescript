FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /build
COPY package*.json ./
COPY tsconfig.json ./
COPY src /app/src
RUN ls -a
RUN npm install 
COPY . ${WORKDIR}
EXPOSE 3000
CMD ["npm", "start"]
