FROM node:8

MAINTAINER wlsdud2194 <wlsdud2194@gmail.com>

WORKDIR /usr/src/kakaoSkillServer/

RUN apt-get update
RUN apt-get install sudo
RUN apt-get install curl
RUN apt-get install apt-transport-https

# yarn 설치
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt-get update && sudo apt-get -y install yarn

COPY package.json package.json

RUN yarn

COPY . .

RUN echo "yarn prod" > "kakaoServer.sh"
RUN chmod 777 kakaoServer.sh
CMD ./kakaoServer.sh
