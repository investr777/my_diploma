function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

var ServiceApi = Vue.resource('/services')
var AdminApi = Vue.resource('/admin{/id}')
var UserApi = Vue.resource('/user')

Vue.component('header-form', {
    template: '<header>' +
        '<div align="right"><a href="/login" class="right">Войти в личный кабинет</a></div>' +
        '<a href="/"><img src="/img/logo.png"></a>' +
        '<h2 align="center">Вас приветствует телефонная станция, Miron Phones!</h2>' +
        '</header>'
});

Vue.component('header-form-admin', {
    template: '<header>' +
        '<div align="right"><a href="/logout" class="right">Покинуть личный кабинет</a></div>' +
        '<a href="/#/admin"><img src="/img/logo.png"></a>' +
        '<h2 align="center">Вас приветствует телефонная станция, Miron Phones!</h2>' +
        '</header>'
});

Vue.component('header-form-user', {
    template: '<header>' +
        '<div align="right"><a href="/logout" class="right">Покинуть личный кабинет</a></div>' +
        '<a href="/#/user"><img src="/img/logo.png"></a>' +
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
    props: ['phone', 'phones', 'editMethod'],
    template: '<tr>' +
        '<td>{{phone.user.fullName}}</td>' +
        '<td>{{phone.user.address}}</td>' +
        '<td>{{phone.phoneNumber}}</td>' +
        '<td>{{phone.active}}</td>' +
        '<td>' +
            '<input type="button" value="Edit" @click="edit" />' +
            '<input type="button" value="X" @click="del" />' +
        '</td>' +
        '</tr>',
    methods: {
        del: function() {
            AdminApi.delete({id: this.phone.id})
                .then(result => {
                if (result.ok) {
                    this.phones.splice(this.phones.indexOf(this.phone), 1)
                }
            })
        },
        edit: function () {
            this.editMethod(this.phone);
        }
    }
});

Vue.component('add-user', {
    props:['phones', 'phoneAttr'],
    data: function() {
        return {
            id: '',
            username: '',
            password: '',
            fullName: '',
            address: '',
            phoneNumber: '',
            // preloaderVisibility: false
        }
    },
    watch: {
        phoneAttr: function(newVal, oldVal) {
            this.id = newVal.id;
            this.username = newVal.user.username;
            this.password = newVal.user.password;
            this.fullName = newVal.user.fullName;
            this.address = newVal.user.address;
            this.phoneNumber = newVal.phoneNumber;
        }
    },
    template:
        '<div>' +
        '<div v-if="!preloaderVisibility" style="padding: 2%">' +
            '<button class="button" @click="preloaderVisibility = true">Добавить абонента</button>' +
        '</div>' +
        '<table v-if="preloaderVisibility">' +
        '<table>' +
            '<tr>' +
                '<td>Логин</td>' +
                '<td><input type="text" placeholder="Username" v-model="username"/></td>' +
                '<td>Пароль</td>' +
                '<td><input type="text" placeholder="Password" v-model="password"/></td>' +
            '</tr>' +
            '<tr>' +
                '<td>ФИО</td>' +
                '<td><input type="text" placeholder="Full name" v-model="fullName"/></td>' +
                '<td>Адрес</td>' +
                '<td><input type="text" placeholder="Address" v-model="address"/></td>' +
            '</tr>' +
            '<tr>' +
                '<td>Телефонный номер: </td>' +
                '<td><input type="text" placeholder="Phone number" v-model="phoneNumber"/></td>' +
                '<td colspan="2" align="center"><button class="button" @click="save">Сохранить</button></td>' +
            '</tr>' +
        '</table>' +
        '</div>',
    methods: {
        save: function () {
            var phone = {
                phoneNumber: this.phoneNumber,
                user: {
                    username: this.username,
                    password: this.password,
                    fullName: this.fullName,
                    address: this.address
                }
            };

            if (this.id){
                AdminApi.update({id: this.id}, phone).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.phones, data.id);
                        this.phones.splice(index,1,data);
                        this.id = ''
                        this.username = ''
                        this.password = ''
                        this.fullName = ''
                        this.address = ''
                        this.phoneNumber = ''
                        this.preloaderVisibility = false
                    }))
            } else {
                AdminApi.save({}, phone).then(result =>
                    result.json().then(data => {
                            this.phones.push(data)
                            this.username = ''
                            this.password = ''
                            this.fullName = ''
                            this.address = ''
                            this.phoneNumber = ''
                            this.preloaderVisibility = false
                        }
                    )
                )
            }
        }
    }
})

Vue.component('phones-list', {
    template:
        '<div>'+
            '<add-user :phones="phones" :phoneAttr="phone"/><br>' +
            '<table>' +
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
                    '<tr is="phone-row" v-for="phone in phones" :key="phone.id" :phone="phone" ' +
                    ':phones="phones" :editMethod="editMethod" :preloaderVisibility="preloaderVisibility"></tr>' +
                '</tbody>' +
            '</table>' +
        '</div>',
    data: function() {
        return {
            phones: [],
            phone: null,
            preloaderVisibility: false
        }
    },
    created: function () {
        AdminApi.get().then(result =>
            result.json().then(data =>
                data.forEach(phone => this.phones.push(phone))))
    },
    methods: {
        editMethod: function(phone) {
            this.phone = phone;
        }
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

const Main = {
    template: '<div><header-form/>' +
        '<hr class="tab">' +
        '<br>' +
        '<services-list/>' +
        '<footer-form/></div>'
}

const User = {
    template: '<div><header-form-user/>' +
        '<hr class="tab">' +
        '<br>' +
        '<users-list/>' +
        '<footer-form/></div>'
}

const Admin = {
    template: '<div><header-form-admin/>' +
            '<hr class="tab">' +
            '<br>' +
            '<div></div>' +
            '<phones-list/>' +
        '<footer-form/></div>'
}

const router = new VueRouter({
    // mode: 'history',
    routes: [
        { path: '/', component: Main },
        { path: '/admin', component: Admin },
        { path: '/user', component: User },
    ]
})

var app = new Vue({
    el: '#main',
    router: router,
});