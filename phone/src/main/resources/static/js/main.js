function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

var RegistrationApi = Vue.resource('/registration')

var AdminApi = Vue.resource('/admin{/id}')
var ServiceAdminApi = Vue.resource('/admin/service{/id}')
var JournalAdminApi = Vue.resource('/admin/journal{/id}')

var UserApi = Vue.resource('/user')
var ServiceUserApi = Vue.resource('/user/service{/id}')
var JournalUserApi = Vue.resource('/user/journal{/id}')


Vue.component('header-form', {
    template: '<header>' +
        '<button class="buttonEnter" style="float: right" onclick="location.href = \'/login\'">Войти в личный кабинет</button>' +
        '<a href="/"><img src="/img/logo.png"></a>' +
        '<br>' +
        '<br>' +
        '<img src="/img/text.png" width="100%"/>' +
        '</header>'
});

Vue.component('header-form-admin', {
    template: '<header>' +
        '<div align="right">Администратор</div>' +
        '<div><button class="buttonExit" style="float: right" onclick="location.href = \'/logout\'">Выйти</button></div>' +
        '<img style="cursor: pointer" title="На главную" src="/img/logo.png" @click="reload">' +
        '<br>' +
        '<br>' +
        '<img src="/img/text.png" width="100%"/>' +
        '</header>',
    methods: {
        reload: function () {
            this.$router.push({path: '/admin'})
            window.location.reload()
        }
    }
});

Vue.component('header-form-user', {
    props: ['userPhone'],
    template: '<header>' +
        '<div align="right" v-for="phone in userPhone">{{ phone.user.fullName }}</div>' +
        '<div><button class="buttonExit" style="float: right" onclick="location.href = \'/logout\'">Выйти</button></div>' +
        '<img style="cursor: pointer" title="На главную" src="/img/logo.png" @click="reload">' +
        '<br>' +
        '<br>' +
        '<img src="/img/text.png" width="100%"/>' +
        '</header>',
    methods: {
        reload: function () {
            this.$router.push({path: '/user'})
            window.location.reload()
        }
    }
});

Vue.component('footer-form', {
    template: '<div align="center">' +
        '<footer>© 2019 телефонная компания "Miron Phones". Все права защищены.</footer>' +
        '</div>'
});



Vue.component('service-row', {
    props: ['service', 'services', 'preloaderVisibility'],
    data: function() {
        return {
            show: this.preloaderVisibility,
            id: '',
            name: '',
            description: '',
            price: ''
        }
    },
    template:
        '<tr>' +
        '<td v-if="!show">{{service.name}}</td>' +
        '<td v-if="!show">{{service.description}}</td>' +
        '<td v-if="!show">{{service.price}}</td>' +
        '<td v-if="show"><input id="nameEdit" type="text" placeholder="Name" v-model="name"/></td>' +
        '<td v-if="show"><input id="descriptionEdit" type="text" placeholder="Description" v-model="description"/></td>' +
        '<td v-if="show"><input id="priceEdit" type="text" placeholder="Price" v-model="price" @keypress="isDouble($event)"/></td>' +
        '<td v-if="!show">' +
        '<img src="/img/edit.png" width="35px" title="Изменить" @click="edit" />' +
        '<img src="/img/del.png" width="35px" title="Удалить" @click="del" />' +
        '</td>' +
        '<td v-if="show">' +
        '<p style="text-align: center"><img src="/img/save.png" width="35px" title="Сохранить" @click="save" /></p>' +
        '</td>' +
        '</tr>',
    methods: {
        isDouble: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode < 48 || charCode > 57)&& charCode !== 46) {
                evt.preventDefault();
            } else {
                if (this.price.indexOf('.') > -1) {
                    if (charCode < 48 || charCode > 57) {
                        evt.preventDefault();
                    } else {
                        return true;
                    }
                }
                return true;
            }
        },
        del: function() {
            ServiceAdminApi.delete({id: this.service.id})
                .then(result => {
                    if (result.ok) {
                        this.services.splice(this.services.indexOf(this.service), 1)
                    }
                })
        },
        edit: function () {
            this.show = true;
            this.id = this.service.id
            this.name = this.service.name
            this.description = this.service.description
            this.price = this.service.price
        },
        save: function () {
            if (this.name === '' || this.price === '' || this.description === '') {
                alert("Заполните все поля")
                if (this.name === '') {
                    document.getElementById('nameEdit').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('nameEdit').style.backgroundColor = "#ffffff"
                }
                if (this.price === '') {
                    document.getElementById('priceEdit').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('priceEdit').style.backgroundColor = "#ffffff"
                }
                if (this.description === '') {
                    document.getElementById('descriptionEdit').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('descriptionEdit').style.backgroundColor = "#ffffff"
                }
            } else {
                var service = {
                    name: this.name,
                    description: this.description,
                    price: this.price,
                };
                ServiceAdminApi.update({id: this.id}, service).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.services, data.id);
                        this.services.splice(index, 1, data);
                        this.id = ''
                        this.name = ''
                        this.description = ''
                        this.price = ''
                        this.show = false
                    }))
            }
        }
    }
});

Vue.component('add-service', {
    props:['services', 'preloaderVisibility'],
    data: function() {
        return {
            id: '',
            name: '',
            description: '',
            price: '',
            show: this.preloaderVisibility,
            errors: []
        }
    },
    template:
        '<div>' +
        '<div v-if="!show" style="padding: 2%">' +
        '<button class="button" @click="show = true">Добавить сервис</button>' +
        '</div>' +
        '<form @submit="checkForm" novalidate="true">' +
        ' <p v-if="errors.length">' +
        '    <b>Заполните корректно поля:</b>' +
        '    <ul>' +
        '      <li v-for="error in errors">{{ error }}</li>' +
        '    </ul>' +
        '  </p>' +
        '<table v-if="show">' +
        '<tr>' +
        '<td>Название: </td>' +
        '<td><input id="name" type="text" placeholder="Name" v-model="name"/></td>' +
        '<td>Стоимость: </td>' +
        '<td><input id="price" type="text" placeholder="Price" v-model="price" @keypress="isDouble($event)"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td>Описание: </td>' +
        '<td colspan="2"><input id="description" type="text" placeholder="Description" v-model="description"/></td>' +
        '<td align="center"><button class="button">Сохранить</button></td>' +
        '</tr>' +
        '</table>' +
        '</form>' +
        '</div>',
    methods: {
        isDouble: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode < 48 || charCode > 57)&& charCode !== 46) {
                evt.preventDefault();
            } else {
                if (this.price.indexOf('.') > -1) {
                    if (charCode < 48 || charCode > 57) {
                        evt.preventDefault();
                    } else {
                        return true;
                    }
                }
                return true;
            }
        },
        checkForm: function (e) {
            this.errors = [];
            if (!this.name) {
                this.errors.push('Укажите название.');
            }
            if (!this.description) {
                this.errors.push('Укажите описание.');
            }
            if (!this.price) {
                this.errors.push('Укажите стоимость.');
            }
            if (this.name === '' || this.price === '' || this.description === '') {
                if (this.name === '') {
                    document.getElementById('name').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('name').style.backgroundColor = "#ffffff"
                }
                if (this.price === '') {
                    document.getElementById('price').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('price').style.backgroundColor = "#ffffff"
                }
                if (this.description === '') {
                    document.getElementById('description').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('description').style.backgroundColor = "#ffffff"
                }
            }
            if (!this.errors.length) {
                var service = {
                    name: this.name,
                    description: this.description,
                    price: this.price,
                };
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
                return true;
            }
            e.preventDefault();
        }
    }
})

Vue.component('services-list', {
    props: ['services'],
    template:
        '<div>'+
        '<add-service :services="services" :preloaderVisibility="preloaderVisibility"/><br>' +
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
        ':services="services" :preloaderVisibility="preloaderVisibility"></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>',
    data: function() {
        return {
            preloaderVisibility: false
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
    props: ['phone', 'phones', 'preloaderVisibility'],
    data: function() {
        return {
            id: '',
            fullName: '',
            address: '',
            phoneNumber: '',
            show: this.preloaderVisibility
        }
    },
    template:
        '<tr>' +
        '<td v-if="!show">{{phone.user.fullName}}</td>' +
        '<td v-if="show"><input id="fullNameEdit" type="text" placeholder="Full name" v-model="fullName"/></td>' +
        '<td v-if="!show">{{phone.user.address}}</td>' +
        '<td v-if="show"><input id="addressEdit" type="text" placeholder="Address" v-model="address"/></td>' +
        '<td v-if="!show">{{phone.phoneNumber}}</td>' +
        '<td v-if="show"><input id="phoneNumberEdit" type="text" placeholder="Phone number" v-model="phoneNumber"' +
        ' @keypress="isNumber($event)" maxlength="12"/></td>' +
        '<td v-if="phone.active">Активен</td>' +
        '<td v-else>Заблокирован</td>' +
        '<td v-if="!show">' +
        '<img src="/img/edit.png" width="35px" title="Изменить" @click="edit" />' +
        '<img src="/img/del.png" width="35px" title="Удалить" @click="del" />' +
        '<img  v-if="phone.active" src="/img/block.png" width="35px" title="Заблокировать" @click="block" />' +
        '<img src="/img/unblock.png" v-else width="35px" title="Разблокировать" @click="block" />' +
        '</td>' +
        '<td v-if="show">' +
        '<p style="text-align: center"><img src="/img/save.png" width="35px" title="Сохранить" @click="save" /></p>' +
        '</td>' +
        '</tr>',
    methods: {
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode < 48 || charCode > 57) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        del: function() {
            AdminApi.delete({id: this.phone.id})
                .then(result => {
                    if (result.ok) {
                        this.phones.splice(this.phones.indexOf(this.phone), 1)
                    }
                })
        },
        block: function () {
            var phoneBlock = { active: false}
            Vue.resource('/admin/block{/id}').update({id: this.phone.id}, phoneBlock)
                .then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.phones, data.id);
                        this.phones.splice(index,1,data);
                    }))
        },
        edit: function(){
            this.show = true;
            this.id = this.phone.id
            this.fullName = this.phone.user.fullName
            this.address = this.phone.user.address
            this.phoneNumber = this.phone.phoneNumber
        },
        save: function () {
            if (this.address === '' || this.fullName === '' || this.phoneNumber === '') {
                alert("Заполните все поля")
                if (this.fullName === '') {
                    document.getElementById('fullNameEdit').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('fullNameEdit').style.backgroundColor = "#ffffff"
                }
                if (this.address === '') {
                    document.getElementById('addressEdit').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('addressEdit').style.backgroundColor = "#ffffff"
                }
                if (this.phoneNumber === '') {
                    document.getElementById('phoneNumberEdit').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('phoneNumberEdit').style.backgroundColor = "#ffffff"
                }
            } else {
            var phone = {
                phoneNumber: this.phoneNumber,
                user: {
                    fullName: this.fullName,
                    address: this.address
                }
            };
            AdminApi.update({id: this.id}, phone).then(result =>
                result.json().then(data => {
                    var index = getIndex(this.phones, data.id);
                    this.phones.splice(index,1,data);
                    this.id = ''
                    this.fullName = ''
                    this.address = ''
                    this.phoneNumber = ''
                    this.show = false
                }))
        }
        }
    }
});

Vue.component('add-phone', {
    props:['phones', 'preloaderVisibility'],
    data: function() {
        return {
            id: '',
            username: '',
            password: '',
            fullName: '',
            address: '',
            phoneNumber: '',
            show: this.preloaderVisibility,
            errors: [],
            findNumber: function (d1, d2) {return (d1.phoneNumber === d2.phoneNumber) ? 1 : -1;}
        }
    },
    template:
        '<div>' +
        '<div v-if="!show" style="padding: 2%">' +
        '<button style="margin: 0px 10px" class="button" @click="show = true">Добавить абонента</button>' +
        '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/?#/admin/service\'">Сервисы</button>' +
        '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/?#/admin/journal\'">Неоплаченные счета</button>' +
        '</div>' +
        '<form @submit="checkForm" novalidate="true">' +
        ' <p v-if="errors.length">' +
        '    <b>Заполните корректно поля:</b>' +
        '    <ul>' +
        '      <li v-for="error in errors">{{ error }}</li>' +
        '    </ul>' +
        '  </p>' +
        '<table v-if="show">' +
        '<tr>' +
        '<td width="15%">Логин</td>' +
        '<td width="35%"><input id="username" type="text" placeholder="Username" v-model="username"/></td>' +
        '<td width="15%">Пароль</td>' +
        '<td width="35%"><input id="password" type="password" placeholder="Password" v-model="password"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td width="15%">ФИО</td>' +
        '<td width="35%"><input id="fullName" type="text" placeholder="Full name" v-model="fullName"/></td>' +
        '<td width="15%">Адрес</td>' +
        '<td width="35%"><input id="address" type="text" placeholder="Address" v-model="address"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td width="15%">Телефонный номер: </td>' +
        '<td width="35%"><input id="phoneNumber" type="text" placeholder="Phone number" v-model="phoneNumber"' +
        ' @keypress="isNumber($event)" maxlength="12"/></td>' +
        '<td width="50%" colspan="2" align="center"><button class="button">Сохранить</button></td>' +
        '</tr>' +
        '</table>' +
        '</form>' +
        '</div>',
    methods: {
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode < 48 || charCode > 57) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        checkForm: function (e) {
            this.errors = [];
            if (!this.username) {
                this.errors.push('Укажите login.');
            }
            if (!this.password) {
                this.errors.push('Укажите пароль.');
            }
            if (!this.fullName) {
                this.errors.push('Укажите ФИО.');
            }
            if (!this.address) {
                this.errors.push('Укажите адрес.');
            }
            if (!this.phoneNumber) {
                this.errors.push('Укажите номер.');
            }
            if (this.username === '' || this.password === '' || this.address === ''
                || this.fullName === '' || this.phoneNumber === '' || this.email === '') {
                if (this.username === '') {
                    document.getElementById('username').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('username').style.backgroundColor = "#ffffff"
                }
                if (this.password === '') {
                    document.getElementById('password').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('password').style.backgroundColor = "#ffffff"
                }
                if (this.fullName === '') {
                    document.getElementById('fullName').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('fullName').style.backgroundColor = "#ffffff"
                }
                if (this.address === '') {
                    document.getElementById('address').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('address').style.backgroundColor = "#ffffff"
                }
                if (this.phoneNumber === '') {
                    document.getElementById('phoneNumber').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('phoneNumber').style.backgroundColor = "#ffffff"
                }
            }
            if(this.phones.some(phone => phone.phoneNumber==this.phoneNumber)){
                this.errors.push("Такой телефонный номер существует!")
            } else {
                if (!this.errors.length) {
                    var phone = {
                        phoneNumber: this.phoneNumber,
                        user: {
                            username: this.username,
                            password: this.password,
                            fullName: this.fullName,
                            address: this.address,
                            active: true
                        }
                    };
                    RegistrationApi.save({}, phone).then(result =>
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
                    ).catch(error => {
                        this.errors.push("Такой login существует!")
                        document.getElementById('username').focus()
                        document.getElementById('username').style.backgroundColor = "#FF0000"
                        this.oldPassword = ''
                        this.newPassword = ''
                    })
                    return true;
                }
            }
            e.preventDefault();
        }
    }
})

Vue.component('phones-list', {
    props: ['phones'],
    template:
        '<div>'+
        '<add-phone :phones="phones" :preloaderVisibility="preloaderVisibility"/><br>' +
        '<table>' +
        '<thead>' +
        '<th colspan="5">Наши абоненты</th>' +
        '</thead>' +
        '<thead>' +
        '<th width="22%">ФИО ' +
        '<img @click="sortParam=\'fullNameDown\'" style="cursor: pointer" width="20px" src="/img/down.png" title="Сортировать по порядку"/>' +
        '<img @click="sortParam=\'fullNameUp\'" style="cursor: pointer" width="20px" src="/img/up.png" title="Сортировать в обратном порядке"/> ' +
        '<input style="width: 80%" type="text" v-model="fullName"/></th>' +
        '<th width="29%">Адрес</th>' +
        '<th width="15%">Номер телефона ' +
        '<img @click="sortParam=\'phoneNumberDown\'" style="cursor: pointer" width="20px" src="/img/down.png" title="Сортировать по порядку"/>' +
        '<img @click="sortParam=\'phoneNumberUp\'" style="cursor: pointer" width="20px" src="/img/up.png" title="Сортировать в обратном порядке"/> ' +
        '</th>' +
        '<th width="19%">Статус ' +
        '<img @click="sortParam=\'activeUp\'" style="cursor: pointer" width="20px" src="/img/down.png" title="Сначала активные"/>' +
        '<img @click="sortParam=\'activeDown\'" style="cursor: pointer" width="20px" src="/img/up.png" title="Сначала заблокированные"/> ' +
        '</th>' +
        '<th width="15%">Действия</th>' +
        '</thead>' +
        '<tbody>' +
        '<tr is="phone-row" v-for="phone in filteredList" :key="phone.id" :phone="phone" ' +
        ':phones="phones" :preloaderVisibility="preloaderVisibility"></tr>' +
        '</tbody>' +
        '</table>' +
        '</div>',
    data: function() {
        return {
            sortParam: '',
            fullName:'',
            preloaderVisibility: false,
            sortByFullNameDown: function (d1, d2) {return (d1.user.fullName > d2.user.fullName) ? 1 : -1;},
            sortByFullNameUp: function (d1, d2) {return (d1.user.fullName > d2.user.fullName) ? -1 : 1;},
            sortByPhoneNumberDown: function (d1, d2) {return (d1.phoneNumber > d2.phoneNumber) ? 1 : -1;},
            sortByPhoneNumberUp: function (d1, d2) {return (d1.phoneNumber > d2.phoneNumber) ? -1 : 1;},
            sortByActiveDown: function (d1, d2) {return (d1.active > d2.active) ? 1 : -1;},
            sortByActiveUp: function (d1, d2) {return (d1.active > d2.active) ? -1 : 1;}
        }
    },
        computed: {
            filteredList: function () {
                var fullName = this.fullName;
                switch(this.sortParam){
                    case 'fullNameDown': return this.phones.sort(this.sortByFullNameDown).filter(function (elem) {
                        if(fullName===''){
                            return true;
                        } else{
                            return elem.user.fullName.toLowerCase().indexOf(fullName) > -1;
                        }
                    });
                    case 'fullNameUp': return this.phones.sort(this.sortByFullNameUp).filter(function (elem) {
                        if(fullName===''){
                            return true;
                        } else{
                            return elem.user.fullName.toLowerCase().indexOf(fullName) > -1;
                        }
                    });
                    case 'phoneNumberDown': return this.phones.sort(this.sortByPhoneNumberDown).filter(function (elem) {
                        if(fullName===''){
                            return true;
                        } else{
                            return elem.user.fullName.toLowerCase().indexOf(fullName) > -1;
                        }
                    });
                    case 'phoneNumberUp': return this.phones.sort(this.sortByPhoneNumberUp).filter(function (elem) {
                        if(fullName===''){
                            return true;
                        } else{
                            return elem.user.fullName.toLowerCase().indexOf(fullName) > -1;
                        }
                    });
                    case 'activeDown': return this.phones.sort(this.sortByActiveDown).filter(function (elem) {
                        if(fullName===''){
                            return true;
                        } else{
                            return elem.user.fullName.toLowerCase().indexOf(fullName) > -1;
                        }
                    });
                    case 'activeUp': return this.phones.sort(this.sortByActiveUp).filter(function (elem) {
                        if(fullName===''){
                            return true;
                        } else{
                            return elem.user.fullName.toLowerCase().indexOf(fullName) > -1;
                        }
                    });
                    default: return this.phones.filter(function (elem) {
                        if(fullName===''){
                            return true;
                        } else{
                            return elem.user.fullName.toLowerCase().indexOf(fullName) > -1;
                        }
                    });
                }
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
    data: function() {
            return {
                id: '',
                oldPassword: '',
                newPassword: '',
                show: false,
                pass: false,
                errors: []
            }
        }
    ,
    template:
        '<div>' +
        '<h2 align="center" v-for="phone in userPhone" v-if="!phone.user.active">Активируйте аккаунт по email</h2>' +
            '<div v-else><div v-if="!show" style="padding: 2%">' +
                '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/?#/user/service\'">Сервисы</button>' +
                '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/?#/user/journal\'">Счета</button>' +
                '<button style="margin: 0px 10px" class="button" @click="edit">Изменить пароль</button>' +
            '</div>' +
            '<div v-if="pass" style="padding: 2%"><label>Старый пароль введен неверно!</label></div>' +
            '<form @submit="checkForm">' +
            ' <p v-if="errors.length">' +
            '    <b>Заполните корректно поля:</b>' +
            '    <ul>' +
            '      <li v-for="error in errors">{{ error }}</li>' +
            '    </ul>' +
            '  </p>' +
            '<div v-if="show" style="padding: 2%">' +
                '<label>Старый пароль: </label>' +
                '<input id="oldPassword" type="password" placeholder="Old password" v-model="oldPassword" />' +
                '<label> Новый пароль: </label>' +
                '<input id="newPassword" type="password" placeholder="New password" v-model="newPassword" />' +
                '<button style="margin: 0px 10px" class="button">Сохранить</button>' +
            '</div>' +
            '</form>' +
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
        '</div>' +
        '</div>',
    methods: {
        edit: function() {
            this.show = true;
            this.id = this.userPhone[0].user.id
        },
        checkForm: function (e) {
            this.errors = [];
            if (!this.oldPassword) {
                this.errors.push('Укажите login.');
            }
            if (!this.newPassword) {
                this.errors.push('Укажите пароль.');
            }
            if (this.oldPassword === '' || this.newPassword === '') {
                if (this.oldPassword === '') {
                    document.getElementById('oldPassword').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('oldPassword').style.backgroundColor = "#ffffff"
                }
                if (this.newPassword === '') {
                    document.getElementById('newPassword').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('newPassword').style.backgroundColor = "#ffffff"
                }
            }
            if (!this.errors.length) {
                var user = {
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword
                }
                UserApi.update({id: this.id}, user).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.userPhone, data.id);
                        this.userPhone.splice(index, 1, data);
                        this.$router.push({path: '/'})
                        alert("Пароль успешно изменен! Авторизируйтесь используя новый пароль.")
                    })
                ).catch(error => {
                    this.pass = true
                    document.getElementById('oldPassword').focus()
                    document.getElementById('oldPassword').style.backgroundColor = "#FF0000"
                    this.oldPassword = ''
                    this.newPassword = ''
                })
                return true;
            }
            e.preventDefault();
        },
    }
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
        '<th colspan="4" v-if="this.userServices.length === 0">У вас нет подключенных услуг</th>' +
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
        '<th colspan="4" v-if="this.allJournals.length === 0">Список пуст</th>' +
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
        '<th colspan="5">Неоплаченные счета</th>' +
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
        '<button style="margin: 0px 10px" class="button" onclick="location.href = \'/#/registration\'">Присоедениться к нам!</button>' +
        '<img src="/img/1.png" width="100%"/>' +
        '<br>' +
        '<img src="/img/2.png" width="100%"/>' +
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
            userPhone: [],
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
        '<button style="margin:10px" class="button" @click="report">Выгрузить в PDF</button>' +
        '<br>' +
        '<user-journalsWithoutPaid-list :allJournals="allJournals"/>' +
        '<br>' +
        '<br>' +
        '<user-journals-list :allJournals="allJournals""/>' +
        '<footer-form/></div>',
    data: function() {
        return {
            journalsWithoutPaid: [],
            allJournals: [],
            journalNoPaid: [],
            journalPaid: []
        }
    },
    created: function () {
        JournalUserApi.get().then(result =>
            result.json().then(data =>
                data.forEach(journal => this.allJournals.push(journal))));
        Vue.resource('/user/journal/noPaid').get().then(result =>
            result.json().then(data =>
                data.forEach(journal => this.journalNoPaid.push(journal))));
        Vue.resource('/user/journal/paid').get().then(result =>
            result.json().then(data =>
                data.forEach(journal => this.journalPaid.push(journal))));
    },
    methods: {
        report: function () {
            var doc = new jsPDF();
            var logo = new Image();
            logo.src = '/img/logo.png'
            var withoutPaid = new Image();
            withoutPaid.src = '/img/top.png'
            var paid = new Image();
            paid.src = '/img/top1.png'
            var column = [
                {dataKey: "period"},
                {dataKey: "price"},
            ];
            doc.addImage(logo, 'PNG',0, 0)
            doc.addImage(withoutPaid, 'PNG', 13, 30)
            doc.autoTable(column, this.journalNoPaid, {margin: {top: 60}});
            doc.addPage()
            doc.addImage(logo, 'PNG',0, 0)
            doc.addImage(paid, 'PNG',13, 30)
            doc.autoTable(column, this.journalPaid,{margin: {top: 60}});
            doc.save('report.pdf')
        }
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

const Registration = {
    data: function() {
        return {
            id: '',
            username: '',
            password: '',
            fullName: '',
            address: '',
            phoneNumber: '',
            email: '',
            phones: [],
            errors: []
        }
    },
    template: '<div><header-form/>' +
        '<hr class="tab">' +
        '<br>' +
        '<form @submit="checkForm" action="/" novalidate="true">' +
        ' <p v-if="errors.length">' +
        '    <b>Заполните корректно поля:</b>' +
        '    <ul>' +
        '      <li v-for="error in errors">{{ error }}</li>' +
        '    </ul>' +
        '  </p>' +
        '<table>' +
        '<tr>' +
        '<td width="15%">Логин</td>' +
        '<td width="35%"><input id="username" type="text" placeholder="Username" v-model="username"/></td>' +
        '<td width="15%">Пароль</td>' +
        '<td width="35%"><input id="password" type="password" placeholder="Password" v-model="password"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td width="15%">ФИО</td>' +
        '<td width="35%"><input id="fullName" type="text" placeholder="Full name" v-model="fullName"/></td>' +
        '<td width="15%">Адрес</td>' +
        '<td width="35%"><input id="address" type="text" placeholder="Address" v-model="address"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td width="15%">Email</td>' +
        '<td width="35%"><input id="email" type="text" placeholder="Email" v-model="email"/></td>' +
        '<td width="15%">Телефонный номер: </td>' +
        '<td width="35%"><input id="phoneNumber" type="text" placeholder="Phone number" v-model="phoneNumber"' +
        ' @keypress="isNumber($event)" maxlength="12"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td width="50%" colspan="2" align="center"><button class="button" >Сохранить</button></td>' +
        '</tr>' +
        '</table>' +
        '</form>' +
        '<footer-form/></div>',
    methods: {
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode < 48 || charCode > 57) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        checkForm: function (e) {
            this.errors = [];
            if (!this.username) {
                this.errors.push('Укажите login.');
            }
            if (!this.password) {
                this.errors.push('Укажите пароль.');
            }
            if (!this.fullName) {
                this.errors.push('Укажите ФИО.');
            }
            if (!this.address) {
                this.errors.push('Укажите адрес.');
            }
            if (!this.phoneNumber) {
                this.errors.push('Укажите номер.');
            }
            if (!this.email) {
                this.errors.push('Укажите электронную почту.');
            } else if (!this.validEmail(this.email)) {
                this.errors.push('Укажите корректный адрес электронной почты.');
            }
            if (this.username === '' || this.password === '' || this.address === ''
                || this.fullName === '' || this.phoneNumber === '' || this.email === '') {
                if (this.username === '') {
                    document.getElementById('username').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('username').style.backgroundColor = "#ffffff"
                }
                if (this.password === '') {
                    document.getElementById('password').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('password').style.backgroundColor = "#ffffff"
                }
                if (this.fullName === '') {
                    document.getElementById('fullName').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('fullName').style.backgroundColor = "#ffffff"
                }
                if (this.address === '') {
                    document.getElementById('address').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('address').style.backgroundColor = "#ffffff"
                }
                if (this.phoneNumber === '') {
                    document.getElementById('phoneNumber').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('phoneNumber').style.backgroundColor = "#ffffff"
                }
                if (this.email === '') {
                    document.getElementById('email').style.backgroundColor = "#FF0000"
                } else {
                    document.getElementById('email').style.backgroundColor = "#ffffff"
                }
            }
            if (!this.errors.length) {
                var phone = {
                    phoneNumber: this.phoneNumber,
                    user: {
                        username: this.username,
                        password: this.password,
                        fullName: this.fullName,
                        address: this.address,
                        email: this.email
                    }
                };
                RegistrationApi.save({}, phone).then(result =>
                    result.json().then(data => {
                            this.phones.push(data)
                            this.username = ''
                            this.password = ''
                            this.fullName = ''
                            this.address = ''
                            this.phoneNumber = ''
                            this.email = ''
                        }
                    )
                )
                return true;
            }
            e.preventDefault();
        },
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
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
        { path: '/user/journal', component: UserJournal },
        { path: '/registration', component: Registration }
    ]
})

var app = new Vue({
    el: '#main',
    router: router,
});

