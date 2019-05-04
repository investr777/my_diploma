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
var ServiceAdminApi = Vue.resource('/admin/service{/id}')
var JournalAdminApi = Vue.resource('/admin/journal{/id}')

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
        '<div align="right">Администратор</div>' +
        '<a href="/#/admin"><img src="/img/logo.png"></a>' +
        '<h2 align="center">Вас приветствует телефонная станция, Miron Phones!</h2>' +
        '</header>'
});

Vue.component('header-form-user', {
    props: ['userPhone'],
    template: '<header>' +
        '<div align="right"><a href="/logout" class="right">Покинуть личный кабинет</a></div>' +
        '<div align="right" v-for="phone in userPhone">{{ phone.user.fullName }}</div>' +
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
    props: ['service', 'services', 'editMethod', 'preloaderVisibility'],
    data: function() {
        return {
            show: this.preloaderVisibility
        }
    },
    template:
        '<tr>' +
        '<td>{{service.name}}</td>' +
        '<td>{{service.description}}</td>' +
        '<td>{{service.price}}</td>' +
        '<td>' +
        '<img src="/img/edit.png" width="35px" title="Изменить" @click="edit" />' +
        '<img src="/img/del.png" width="35px" title="Удалить" @click="del" />' +
        '</td>' +
        '</tr>',
    methods: {
        del: function() {
            ServiceAdminApi.delete({id: this.service.id})
                .then(result => {
                    if (result.ok) {
                        this.services.splice(this.services.indexOf(this.service), 1)
                    }
                })
        },
        edit: function () {
            this.editMethod(this.service);
        }
    }
});

Vue.component('add-service', {
    props:['services', 'serviceAttr', 'preloaderVisibility'],
    data: function() {
        return {
            id: '',
            name: '',
            description: '',
            price: '',
            show: this.preloaderVisibility
        }
    },
    watch: {
        serviceAttr: function(newVal, oldVal) {
            this.id = newVal.id;
            this.name = newVal.name;
            this.description = newVal.description;
            this.price = newVal.price;
        }
    },
    template:
        '<div>' +
        '<div v-if="!show" style="padding: 2%">' +
        '<button class="button" @click="show = true">Добавить сервис</button>' +
        '</div>' +
        '<table v-if="show">' +
        '<tr>' +
        '<td>Название: </td>' +
        '<td><input type="text" placeholder="Name" v-model="name"/></td>' +
        '<td>Стоимость: </td>' +
        '<td><input type="text" placeholder="Price" v-model="price"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td>Описание: </td>' +
        '<td colspan="2"><input type="text" placeholder="Description" v-model="description"/></td>' +
        '<td align="center"><button class="button" @click="save">Сохранить</button></td>' +
        '</tr>' +
        '</table>' +
        '</div>',
    methods: {
        save: function () {
            var service = {
                name: this.name,
                description: this.description,
                price: this.price,
            };

            if (this.id){
                ServiceAdminApi.update({id: this.id}, service).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.services, data.id);
                        this.services.splice(index,1,data);
                        this.id = ''
                        this.name = ''
                        this.description = ''
                        this.price = ''
                        this.show = false
                    }))
            } else {
                ServiceAdminApi.save({}, service).then(result =>
                    result.json().then(data => {
                            this.services.push(data)
                            this.name = ''
                            this.description = ''
                            this.price = ''
                            this.show = false
                        }
                    )
                )
            }
        }
    }
})

Vue.component('services-list', {
    props: ['services'],
    template:
        '<div>'+
        '<add-service :services="services" :serviceAttr="service" :preloaderVisibility="preloaderVisibility"/><br>' +
        '<table>' +
        '<thead>' +
        '<th colspan="4">Наши услуги</th>' +
        '</thead>' +
        '<thead>' +
        '<th>Название</th>' +
        '<th>Описание</th>' +
        '<th>Стоимость</th>' +
        '<th>Действия</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="service-row" v-for="service in services" :key="service.id" :service="service"' +
        ':services="services" :editMethod="editMethod" :preloaderVisibility="preloaderVisibility"></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>',
    data: function() {
        return {
            service: null,
            preloaderVisibility: false
        }
    },
    methods: {
        editMethod: function(service) {
            this.service = service;
        }
    }
});



Vue.component('journalWithPaid-row', {
    props: ['journal'],
    template:
        '<tr>' +
        '<td>{{journal.phone.user.fullName}}</td>' +
        '<td>{{journal.phone.phoneNumber}}</td>' +
        '<td>{{journal.period}}</td>' +
        '<td>{{journal.price}}</td>' +
        '</tr>'
})

Vue.component('journalsWithPaid-list', {
    props: ['journals'],
    template:
        '<div>'+
        '<table>' +
        '<thead>' +
        '<th colspan="4">Неоплаченные счета</th>' +
        '</thead>' +
        '<thead>' +
        '<th>ФИО</th>' +
        '<th>Номер телефона</th>' +
        '<th>Период</th>' +
        '<th>Сумма</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="journalWithPaid-row" v-for="journal in journals" :key="journal.id" :journal="journal"></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>'
})



Vue.component('phone-row', {
    props: ['phone', 'phones', 'editMethod', 'preloaderVisibility'],
    data: function() {
        return {
            show: this.preloaderVisibility
        }
    },
    template:
        '<tr>' +
        '<td>{{phone.user.fullName}}</td>' +
        '<td>{{phone.user.address}}</td>' +
        '<td>{{phone.phoneNumber}}</td>' +
        '<td v-if="phone.active">Активен</td>' +
        '<td v-else>Заблокирован</td>' +
        '<td>' +
        '<img src="/img/edit.png" width="35px" title="Изменить" @click="edit" />' +
        '<img src="/img/del.png" width="35px" title="Удалить" @click="del" />' +
        '<img  v-if="phone.active" src="/img/block.png" width="35px" title="Заблокировать" @click="block" />' +
        '<img src="/img/unblock.png" v-else width="35px" title="Разблокировать" @click="block" />' +
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
        },
        block: function () {
            var phoneBlock = { active: false}
            Vue.resource('/admin/block{/id}').update({id: this.phone.id}, phoneBlock)
                .then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.phones, data.id);
                        this.phones.splice(index,1,data);
                    }))
        }
    }
});

Vue.component('add-phone', {
    props:['phones', 'phoneAttr', 'preloaderVisibility'],
    data: function() {
        return {
            id: '',
            username: '',
            password: '',
            fullName: '',
            address: '',
            phoneNumber: '',
            show: this.preloaderVisibility
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
        '<div v-if="!show" style="padding: 2%">' +
        '<button style="margin: 0px 10px" class="button" @click="show = true">Добавить абонента</button>' +
        '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/#/admin/service\'">Сервисы</button>' +
        '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/#/admin/journal\'">Неоплаченные счета</button>' +
        '</div>' +
        '<table v-if="show">' +
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
                        this.show = false
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
                            this.show = false
                        }
                    )
                )
            }
        }
    }
})

Vue.component('phones-list', {
    props: ['phones'],
    template:
        '<div>'+
        '<add-phone :phones="phones" :phoneAttr="phone" :preloaderVisibility="preloaderVisibility"/><br>' +
        '<table>' +
        '<thead>' +
        '<th colspan="5">Наши абоненты</th>' +
        '</thead>' +
        '<thead>' +
        '<th width="22%">ФИО</th>' +
        '<th width="29%">Адрес</th>' +
        '<th width="15%">Номер телефона</th>' +
        '<th width="19%">Статус</th>' +
        '<th width="15%">Действия</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="phone-row" v-for="phone in phones" :key="phone.id" :phone="phone" ' +
        ':phones="phones" :editMethod="editMethod" :preloaderVisibility="preloaderVisibility"></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>',
    data: function() {
        return {
            phone: null,
            preloaderVisibility: false
        }
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
    props: ['userPhone'],
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
        '</table>'
});

const Main = {
    template: '<div><header-form/>' +
        '<hr class="tab">' +
        '<br>' +
        // '<services-list/>' +
        '<footer-form/></div>'
}

const User = {
    template: '<div><header-form-user :userPhone="userPhone"/>' +
        '<hr class="tab">' +
        '<br>' +
        '<users-list :userPhone="userPhone"/>' +
        '<footer-form/></div>',
    data: function() {
        return {
            userPhone: []
        }
    },
    created: function () {
        UserApi.get().then(result =>
            result.json().then(phone => this.userPhone.push(phone)))
    }
}

const Admin = {
    template: '<div><header-form-admin/>' +
        '<hr class="tab">' +
        '<br>' +
        '<phones-list :phones="phones"/>' +
        '<footer-form/></div>',
    data: function() {
        return {
            phones: [],
        }
    },
    created: function () {
        AdminApi.get().then(result =>
            result.json().then(data =>
                data.forEach(phone => this.phones.push(phone))))
    }
}

const AdminService = {
    template: '<div><header-form-admin/>' +
        '<hr class="tab">' +
        '<br>' +
        '<services-list :services="services"/>' +
        '<footer-form/></div>',
    data: function() {
        return {
            services: [],
        }
    },
    created: function () {
        ServiceAdminApi.get().then(result =>
            result.json().then(data =>
                data.forEach(service => this.services.push(service))))
    }
}

const AdminJournalsWithoutPaid = {
    template: '<div><header-form-admin/>' +
        '<hr class="tab">' +
        '<br>' +
        '<journalsWithPaid-list :journals="journals"/>' +
        '<footer-form/></div>',
    data: function() {
        return {
            journals: [],
        }
    },
    created: function () {
        JournalAdminApi.get().then(result =>
            result.json().then(data =>
                data.forEach(journal => this.journals.push(journal))))
    }
}

const router = new VueRouter({
    // mode: 'history',
    routes: [
        { path: '/', component: Main },
        { path: '/admin', component: Admin },
        { path: '/admin/service', component: AdminService },
        { path: '/admin/journal', component: AdminJournalsWithoutPaid },
        { path: '/user', component: User },
    ]
})

var app = new Vue({
    el: '#main',
    router: router,
});