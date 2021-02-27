# étape de build
#FROM node as build-stage
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . ./
#RUN npm run build

# étape de production
FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html
#COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]