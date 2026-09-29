FROM node:18-alpine

# working directory 
WORKDIR /app

# copy only package.json adn install dependancies
COPY package*.json ./
RUN npm install

# copy remaining code 
COPY . .

# generate prisma client 
RUN npx prisma generate

# expose server
EXPOSE 8000

# server starting command
CMD ["npm", "run", "dev"]