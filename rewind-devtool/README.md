# Solid Rewind

A time-travel debugger for SolidJS.

Use this with our chrome extension: [Solid Rewind Extension](https://chrome.google.com/webstore/detail/solid-rewind/ejdinegdopmimnkbonknknhfmmcgcdoh) 


ATTENTION: This extension is still in development.

Features that will be within scope by Jan 15 release:
* Support for state in stores.
* Dev-only run. Currently our code runs even in production mode.
* Tree view of component hierarchy.

# instructions:
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

That's it! Build your project and open our chrome extention along-side it.

