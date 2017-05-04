## Example:

```js
var jxls = require('jxls');

jxls.init()
    .then(function (transformer) {
        var data = { departments: [{ name: 'Test' }, { name: 'Test2' }] };
        return transformer.transform('template.xls', 'result.xls', data);
    })
    .then(function () {
        console.log('done');
    })
    .catch(function (err) {
        console.error(err);
    });
```