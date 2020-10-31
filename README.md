# Flux Store Pattern

Custom implementation of the Flux Pattern

https://facebook.github.io/flux/docs/in-depth-overview

```javascript

const INCREMENT = "INCREMENT";

var initState = {
    count: Flux.Types.Integer(0)
}

$dispatcher = new Flux.Dispatcher({
    [INCREMENT](state, action) {
        return _assign(state, {
            count: state.count + 1
        });
    }
});

$store = new Flux.Store($dispatcher, initState)

$store.subscribe(function(state) {
    console.log('state update')
    console.log(state)
})

$store.dispatch(INCREMENT)
$store.dispatch(INCREMENT)
$store.dispatch(INCREMENT)
```
