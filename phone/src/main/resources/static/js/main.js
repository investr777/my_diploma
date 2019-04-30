var ServiceApi = Vue.resource('/services')
var AdminApi = Vue.resource('/admin')
var UserApi = Vue.resource('/user')

Vue.component('header-form', {
    template: '<header>' +
        '<div align="right"><a href="/login" class="right">Войти в личный кабинет</a></div>' +
        '<a href="/"><img src="/img/logo.png"></a>' +
        '<h2 align="center">Вас приветствует телефонная станция, Miron Phones!</h2>' +
        '</header>'
});

Vue.component('header-form-exit', {
    template: '<header>' +
        '<div align="right"><a href="/logout" class="right">Покинуть личный кабинет</a></div>' +
        '<a href="/"><img src="/img/logo.png"></a>' +
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
    data: function() {
        return {
            services: []
        }
    },
    created: function () {
        ServiceApi.get().then(result =>
            result.json().then(data =>
                data.forEach(service => this.services.push(service))))
    }
});

Vue.component('phone-row', {
    props: ['phone'],
    template: '<tr>' +
        '<td>{{phone.user.fullName}}</td>' +
        '<td>{{phone.user.address}}</td>' +
        '<td>{{phone.phoneNumber}}</td>' +
        '<td>{{phone.active}}</td>' +
        '<td><input type="button" value="X" @click="del" /></td>' +
        '</tr>',
    methods: {
        del: function() {
            messageApi.remove({id: this.message.id}).then(result => {
                if (result.ok) {
                    this.messages.splice(this.messages.indexOf(this.message), 1)
                }
            })
        }
    }
});

Vue.component('phones-list', {
    template: '<table>' +
        '<thead>' +
        '<th colspan="5">Наши абоненты</th>' +
        '</thead>' +
        '<thead>' +
        '<th>ФИО</th>' +
        '<th>Адрес</th>' +
        '<th>Номер телефона</th>' +
        '<th>Статус</th>' +
        '<th>Действия</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="phone-row" v-for="phone in phones" :key="phone.id" :phone="phone"></tr>' +
        '</tbody>' +
        '</table>',
    data: function() {
        return {
            phones: []
        }
    },
    created: function () {
        AdminApi.get().then(result =>
            result.json().then(data =>
                data.forEach(phone => this.phones.push(phone))))
    }
});

Vue.component('user-row', {
    props: ['phone'],
    template: '<tr>' +
        '<td>{{phone.user.fullName}}</td>' +
        '<td>{{phone.user.address}}</td>' +
        '<td>{{phone.phoneNumber}}</td>' +
        '<td>{{phone.active}}</td>' +
        '</tr>'
});

Vue.component('users-list', {
    template: '<table>' +
        '<thead>' +
        '<th colspan="4">Информация о вашем телефонном номере</th>' +
        '</thead>' +
        '<thead>' +
        '<th>ФИО</th>' +
        '<th>Адрес</th>' +
        '<th>Номер телефона</th>' +
        '<th>Статус</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="user-row" v-for="phone in userPhone" :key="phone.id" :phone="phone"></tr>' +
        '</tbody>' +
        '</table>',
    data: function() {
        return {
            userPhone: []
        }
    },
    created: function () {
        UserApi.get().then(result =>
            result.json().then(phone => this.userPhone.push(phone)))
    }
});

const User = {
    template: '<div><header-form-exit/>' +
        '<hr class="tab">' +
        '<br>' +
        '<users-list></users-list>' +
        '<footer-form/></div>'
}

const Admin = {
    template: '<div><header-form-exit/>' +
            '<hr class="tab">' +
            '<br>' +
            '<phones-list></phones-list>' +
        '<footer-form/></div>'
}

const Main = {
    template: '<div><header-form/>' +
        '<hr class="tab">' +
        '<br>' +
        '<services-list/>' +
        '<footer-form/></div>'
}

const router = new VueRouter({
    // mode: 'history',
    routes: [
        { path: '/admin', component: Admin },
        { path: '/user', component: User },
        { path: '/', component: Main }
    ]
})

var app = new Vue({
    el: '#main',
    router: router
});