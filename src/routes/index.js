/**
* Use this for all paths since we just need to resolve index.html for any given path.
* react-router will take over and show the relevant component.
* 
* TODO: add a 404 handler for paths not defined in react-router
*/
const fileHandler = {
    testNothing: console.log('fileHandler'),
    handler: (req, res) => {
        console.log('boop');
        console.log(res.file('index.html'));
        return res.file('index.html');
    }
}

const routes = [
    { method: 'GET', path: '/login', config: fileHandler },
]

module.exports = routes;