#
#   Created by Carl Voller.
#   Dockerfile to create node image to run Drawing Board
#
#   Notes to self: Do not attempt to run this container on any musl-libc distro. (aka alpine)
#   The node-canvas package does not have a musl-libc build available so stick to glibc distros.
#

FROM node:14.17.3-slim

# Set Environment Variables
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=PRODUCTION

# Copy
COPY . /tmp
WORKDIR /tmp

# Delete existing host install of node_modules or builds.
RUN rm -rf build node_modules static/node_modules

# Install packages in node:14.17.3 debian environment and build app
RUN npm run setup
RUN npm run build-app

# Run the server
CMD ["node", "./build/index.js"]