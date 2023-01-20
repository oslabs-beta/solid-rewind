<p align="center">
<img src="https://user-images.githubusercontent.com/108890716/213749839-3d58dbea-106d-4bfb-8724-b41fe00c55d5.png" />
</p>


<h2>About</h2>

**Solid Rewind is a time-trave debugger and component-tree visualizer for the reactive framework, SolidJS**


<p align="center">
  <img src="https://user-images.githubusercontent.com/108890716/213750313-3eaa059f-6abe-4d18-b257-1b1d1fe5c3a2.gif" alt="animated" />
</p>


<h3><ins>Features</ins></h3>

* Redux-style time-travel debugging, allowing you to ‘rewind’ to previous versions of your application’s state.
* Dynamic, D3-visualization of your component tree
* Integration with Chrome’s existing Dev Tools menu so you can troubleshoot your Solid App directly from your browser.



<h2>Installation</h2>

**First, Download our Chrome extension [here](https://chrome.google.com/webstore/detail/solid-rewind/ejdinegdopmimnkbonknknhfmmcgcdoh)**

<h3><ins>Setup</ins></h3>

1. install our package with

```javascript
npm i solid-rewind
```

2. Import our Rewind component at the top level of your app.
3. Wrap your top-level component in our <Rewind> component.
```javascript
import Rewind from 'solid-rewind';

render( () => {
    <Rewind>
        <App />
    </Rewind>
}, document.getElementById('root'));

```
That's it! Build your project and access our tool in the chrome devtools menu!

<h2>Authors</h2>
    
* Robbie Gottlieb | [@Boblobblieb](https://github.com/Boblobblieb) | [LinkedIn](https://www.linkedin.com/in/robbie-gottlieb/) 
* Willem Rosenthal | [@willemrosenthal](https://github.com/willemrosenthal) | [LinkedIn](https://www.linkedin.com/in/willem-rosenthal/)  
* Christian Catanese [@c-catanese](https://github.com/c-catanese) | [LinkedIn](https://www.linkedin.com/in/christian-catanese/)   
* Jason Moon | [@Crescent0130](https://github.com/Crescent0130) | [LinkedIn](https://www.linkedin.com/in/jason-joonsik-moon/)


<h2>Contributing</h2>
Solid Rewind launched on January 15, 2023 and is currently in active beta development through the OSlabs community initiative. The application is licensed under the terms of the MIT license, making it a fully open source product. Developers are welcome to contribute to the codebase and expand on its features.
