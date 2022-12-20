
# Solid Rewind

A time-travel debugger for SoldJs.
This works with our chrome extention found here: <extention>


ATTENTION: This extention is IN DEVELOPMENT.
Please expect a full relese by Jan 15th. 

Features that will be done then:
* support for sate in stores.
* dev-only code. currently our code runs even in production mode.
* (potential) tree view

# instructions:
install our package with


```javascript
npm i solid-rewind
```

Then import our Rewind component at the top level of your app.
Then wrap your top level component in our <Rewind> component.
```javascript
import Rewind from 'solid-rewind';

render( () => {
    <Rewind>
        <App />
    </Rewind>
}, document.getElementById('root'));

```

That's it! Build your project and open our chrome extention along-side it.
