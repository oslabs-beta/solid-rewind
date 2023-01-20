<p align="center">
<img src="https://user-images.githubusercontent.com/108890716/213731944-82d1e802-9d56-492e-9c7b-0cb10b1a151c.png" />
</p>

<h1>Solid Rewind</h1>

<h2>About</h2>
A time-travel debugger for SolidJS.

<h4>Features</h4>

* Support for state in stores.
* Dev-only run. Currently our code runs even in production mode.
* Tree view of component hierarchy.


<h2>Installation</h2>
<h3>Prerequisites</h3>

Download our Chrome extension [here](https://chrome.google.com/webstore/detail/solid-rewind/ejdinegdopmimnkbonknknhfmmcgcdoh)

<h3>Setup</h3>

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


Features that will be within scope by Jan 15 release:
* Support for state in stores.
* Dev-only run. Currently our code runs even in production mode.
* Tree view of component hierarchy.

