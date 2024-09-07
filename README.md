![Logo](https://github.com/user-attachments/assets/8c1534b8-6ad6-4c84-b855-2d16bf6b774a)

# beamng.cluster
BeamNG.cluster is a Node.js based server control panel for [BeamMP](https://github.com/beammp) servers. This project aims to take a simple server-manager idea and create a multi-server administration tool using an intuitive Dashboard. 

# Media
###### Static prototype

![image](https://github.com/user-attachments/assets/a0739b20-b64c-4ab9-887a-9ba168d429b1)

![image](https://github.com/user-attachments/assets/f1877b6c-b451-45c7-938d-772c09c67aa1)

# TO-DO

* Frontend ✅
* Backend 🏗️
* API 🏗️
* Read server data ✅
* Write server data ❌
* Login / Account management ❌
* Favicon ❌
* Mod management ❌
* Built-in console ❌
* Network monitoring card ❌
* Resource usage card ❌ 
* Server status / stats card ❌
* Control Panel 🏗️
* Server List 🏗️

# Setup

## Installation

> 🏗️ Work in progress, the below instructions are for development purposes.

i. Clone this repo to desired directory

ii. Navigate to directory using favoured terminal

iii. Run `npm install`

iv. Run `node app.js`

v. Begin developing ✌️

## File structure
```
├── ...
├── config.json
│   ├── ℹ️ This houses configuration for beamng.cluster itself.
│   ├──    This is edited and read by it.
│   └──    You should not update this manually, unless you need to.
│ 
├── 📂 servers
|  ├── ℹ️ Your BeamMP servers go here.
│  │
│  ├── 📁 server1
│  │    ├── ...
│  │    └── ServerConfig.toml
│  │
│  └── 📁 server2
│  │    ├── ...
│  │    └── ServerConfig.toml
```
