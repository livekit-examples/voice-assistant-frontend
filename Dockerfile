FROM node:20.18.1
WORKDIR /voice-assistant-frontend
COPY . .
RUN npm install -g pnpm && \
    pnpm install
EXPOSE 3000
CMD ["pnpm","dev"]
