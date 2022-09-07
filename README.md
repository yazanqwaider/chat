# Chat Application

### # Features
- Explore people and request to be a friend.
- Accept and decline the friendship requests.
- Send messages by these types (text, image, voice-recording).
- When a user wants to type a message, the ```(Typing now ...)``` note will be shown on another side of chat.


### # Preview

![Home page](https://raw.githubusercontent.com/yazanqwaider/chat/main/public/images/preview/homepage.png)


### # Installation
- First of all, clone the project on your device.
- Copy .env.example file by new name .env.
- Edit .env file by your configrations.
- You can generate ACCESS_TOKEN_SECRET value by running this command : ``` npm run key:generate ```.
- Install the packages by: ``` npm install ```.
- Run this command to serve application: ``` npm run serve ```.
- run this command to watch css files changes and build dist folder: ``` npm run watch ```, or ```npm run dev``` if you want without watching.


### # Used Frameworks & Tools
- Node.js
- express.js, ejs
- socket io
- Tailwindcss
