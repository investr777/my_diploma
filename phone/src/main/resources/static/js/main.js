var ServiceApi = Vue.resource('/services')

Vue.component('header-form', {
    template: '<header>' +
        '<div align="right"><a href="/login" class="right">Войти в личный кабинет</a></div>' +
        '<a href="#"><img src="/img/logo.png"></a>' +
        '<h2 align="center">Вас приветствует телефонная станция, Miron Phones!</h2>' +
        '</header>'
});

Vue.component('footer-form', {
    template: '<div align="center">' +
        '<footer>© 2019 телефонная компания "Miron Phones". Все права защищены.</footer>' +
        '</div>'
});

Vue.component('service-row', {
    props: ['service'],
    template: '<tr>' +
        '<td>{{service.name}}</td>' +
        '<td>{{service.description}}</td>' +
        '<td>{{service.price}}</td>' +
        '</tr>'
});

Vue.component('services-list', {
    props: ['services'],
    template: '<table>' +
        '<thead>' +
        '<th colspan="3">Наши услуги</th>' +
        '</thead>' +
        '<thead>' +
        '<th>Название</th>' +
        '<th>Описание</th>' +
        '<th>Стоимость</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="service-row" v-for="service in services" :key="service.id" :service="service"></tr>' +
        '</tbody>' +
        '</table>',
    created: function () {
        ServiceApi.get().then(result =>
    result.json().then(data =>
    data.forEach(service => this.services.push(service))))
    }
});

var app = new Vue({
    el: '#main',
    template: '<div><header-form/>' +
        '<hr class="tab">' +
        '<br>' +
        '<services-list :services="services"/>' +
        '<footer-form/></div>',
    data: {
        services: []
    }
});