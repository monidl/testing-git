FROM ubuntu

# Java installation
RUN apt-get update
RUN apt install -y openjdk-8-jdk

# Nodejs installation
RUN apt-get install -y curl 
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

# Chrome installation
RUN apt-get install -y wget 
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update && apt-get install -y google-chrome-stable

# Chromedriver
RUN apt-get install -y unzip
RUN wget -q https://chromedriver.storage.googleapis.com/2.39/chromedriver_linux64.zip
RUN unzip chromedriver_linux64.zip -d /usr/local/bin

# yarn install
RUN npm -g i yarn
RUN npm install -g grunt grunt-cli

WORKDIR /opt
COPY . ./testing-git/
WORKDIR /opt/testing-git
RUN npm install
CMD ["./node_modules/.bin/wdio"]
