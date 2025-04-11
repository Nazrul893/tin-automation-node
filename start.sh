#!/bin/bash

# Chrome ইন্সটল করার জন্য কমান্ড
apt-get update
apt-get install -y wget gnupg unzip
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt-get install -y ./google-chrome-stable_current_amd64.deb

# এখন Node.js app চালু করো
node index.js
