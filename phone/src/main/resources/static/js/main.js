Vue.component('main-form', {
    template: '<div>' +
                '<div><img src="/img/logo.png" /></div>' +
            '</div>'
})

var app = new Vue({
    el: '#app',
    template: '<div><main-form/></div>',
});