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
var ServiceAdminApi = Vue.resource('/admin/service{/id}')
var JournalAdminApi = Vue.resource('/admin/journal{/id}')

var UserApi = Vue.resource('/user')
var ServiceUserApi = Vue.resource('/user/service{/id}')
var JournalUserApi = Vue.resource('/user/journal{/id}')

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
        '<td v-if="phone.active">Активен</td>' +
        '<td v-else>Заблокирован</td>' +
        '</tr>'
});

Vue.component('users-list', {
    props: ['userPhone'],
    template:
        '<div>' +
            '<div style="padding: 2%">' +
                '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/#/user/service\'">Сервисы</button>' +
                '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/#/user/journal\'">Счета</button>' +
            '</div>' +
            '<table>' +
                '<thead>' +
                    '<th colspan="4">Информация о вашем телефонном номере</th>' +
                '</thead>' +
                '<thead>' +
                    '<th width="27">ФИО</th>' +
                    '<th width="34">Адрес</th>' +
                    '<th width="20">Номер телефона</th>' +
                    '<th width="19">Статус</th>' +
                '</thead>' +
                '<tbody>' +
                    '<tr is="user-row" v-for="phone in userPhone" :key="phone.id" :phone="phone"></tr>' +
                '</tbody>' +
            '</table>' +
        '</div>'
});



Vue.component('user-service-row', {
    props: ['userService', 'userServices'],
    template:
        '<tr>' +
        '<td>{{userService.service.name}}</td>' +
        '<td>{{userService.service.description}}</td>' +
        '<td>{{userService.service.price}}</td>' +
        '<td>' +
        '<p style="text-align: center"><img src="/img/del.png" width="35px" title="Удалить" @click="del" /></p>' +
        '</td>' +
        '</tr>',
    methods: {
        del: function() {
            ServiceUserApi.delete({id: this.userService.id})
                .then(result => {
                    if (result.ok) {
                        this.userServices.splice(this.userServices.indexOf(this.userService), 1)
                    }
                })
        }
    }
});

Vue.component('user-services-list', {
    props: ['userServices'],
    template:
        '<div>'+
        '<table>' +
        '<thead>' +
        '<th colspan="4">Ваши услуги</th>' +
        '</thead>' +
        '<thead>' +
        '<th>Название</th>' +
        '<th>Описание</th>' +
        '<th>Стоимость</th>' +
        '<th>Действия</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="user-service-row" v-for="service in userServices" :key="service.id" :userService="service"' +
        ':userServices="userServices"></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>',
});



Vue.component('all-service-row', {
    props: ['service', 'userServices'],
    template:
        '<tr>' +
        '<td>{{service.name}}</td>' +
        '<td>{{service.description}}</td>' +
        '<td>{{service.price}}</td>' +
        '<td>' +
        '<p style="text-align: center"><img src="/img/plus.png" width="35px" title="Подключить" @click="add" /></p>' +
        '</td>' +
        '</tr>',
    methods: {
        add: function() {
            ServiceUserApi.save({}, this.service)
                .then(result => {
                    if (result.ok) {
                        result.json().then(data => {
                            this.userServices.push(data)
                        })
                    }
                })
        }
    }
});

Vue.component('all-services-list', {
    props: ['allServices', 'userServices'],
    template:
        '<div>'+
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
                    '<tr is="all-service-row" v-for="service in allServices" :key="service.id" :service="service"' +
                    ':userServices="userServices"/>' +
                '</tbody>' +
            '</table>' +
        '</div>'
});


Vue.component('user-journal-row', {
    props: ['journal'],
    template: '<tr v-if="journal.paid">' +
        '<td>{{journal.phone.phoneNumber}}</td>' +
        '<td>{{journal.period}}</td>' +
        '<td>{{journal.price}}</td>' +
        '<td v-if="journal.paid">Оплачен</td>' +
        '<td v-else>Не оплачен</td>' +
        '</tr>'
});

Vue.component('user-journals-list', {
    props: ['allJournals'],
    template:
        '<div>' +
        '<table>' +
        '<thead>' +
        '<th colspan="4">Оплаченные счета</th>' +
        '</thead>' +
        '<thead>' +
        '<th>Номер телефона</th>' +
        '<th>Период</th>' +
        '<th>Сумма</th>' +
        '<th>Состояние</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="user-journal-row" v-for="journal in allJournals" :key="journal.id" :journal="journal"></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>'
});


Vue.component('user-journalWithoutPaid-row', {
    props: ['journal', 'allJournals'],
    template: '<tr v-if="!journal.paid">' +
        '<td>{{journal.phone.phoneNumber}}</td>' +
        '<td>{{journal.period}}</td>' +
        '<td>{{journal.price}}</td>' +
        '<td v-if="journal.paid">Оплачен</td>' +
        '<td v-else>Не оплачен</td>' +
        '<td><p style="text-align: center"><img src="/img/oplata.png" width="35px" title="Оплатить" @click="paid" /></p></td>' +
        '</tr>',
    methods: {
        paid: function () {
            var journalPaid = { paid: true}
            JournalUserApi.update({id: this.journal.id}, journalPaid)
                .then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.allJournals, data.id);
                        this.allJournals.splice(index,1,data);
                    }))
        }
    }
});

Vue.component('user-journalsWithoutPaid-list', {
    props: ['allJournals'],
    template:
        '<div>' +
        '<table>' +
        '<thead>' +
        '<th colspan="5">Не оплаченные счета</th>' +
        '</thead>' +
        '<thead>' +
        '<th>Номер телефона</th>' +
        '<th>Период</th>' +
        '<th>Сумма</th>' +
        '<th>Состояние</th>' +
        '<th>Действие</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="user-journalWithoutPaid-row" v-for="journal in allJournals"' +
        ':key="journal.id" :journal="journal" :allJournals="allJournals"></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>'
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

const UserService = {
    template: '<div><header-form-user/>' +
        '<hr class="tab">' +
        '<br>' +
        '<user-services-list :userServices="userServices"/>' +
        '<br>' +
        '<br>' +
        '<all-services-list :allServices="allServices" :userServices="userServices"/>' +
        '<footer-form/></div>',
    data: function() {
        return {
            userServices: [],
            allServices: []
        }
    },
    created: function () {
        ServiceUserApi.get().then(result =>
            result.json().then(data =>
                data.forEach(service => this.userServices.push(service))));

        Vue.resource('/user/service/services').get().then(result =>
            result.json().then(data =>
                data.forEach(service => this.allServices.push(service))))
    }
}

const UserJournal = {
    template: '<div><header-form-user/>' +
        '<hr class="tab">' +
        '<br>' +
        '<user-journalsWithoutPaid-list :allJournals="allJournals"/>' +
        '<br>' +
        '<br>' +
        '<user-journals-list :allJournals="allJournals""/>' +
        '<footer-form/></div>',
    data: function() {
        return {
            journalsWithoutPaid: [],
            allJournals: []
        }
    },
    created: function () {
        JournalUserApi.get().then(result =>
            result.json().then(data =>
                data.forEach(journal => this.allJournals.push(journal))));
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
        { path: '/user/service', component: UserService },
        { path: '/user/journal', component: UserJournal }
    ]
})

var app = new Vue({
    el: '#main',
    router: router,
});