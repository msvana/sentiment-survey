FROM node:slim
WORKDIR /app
VOLUME /app/data

COPY . /app
RUN npm install

EXPOSE 3000
CMD ["node", "app.js"]
