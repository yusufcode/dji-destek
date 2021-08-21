CKEDITOR.replace( 'ckeditor' );

/* SHOW SIGN-UP*/
$(document).on('click', '.admin-login-page .show-sign-up-form', function() {

    $('.admin-login-page .login-signin.show').fadeIn(0).removeClass('show')
    $('.admin-login-page .login-signup').fadeIn(200).addClass('show')

})

/* SHOW SIGN-IN */
$(document).on('click', '.admin-login-page .show-sign-in-form', function() {

    $('.admin-login-page .login-signup.show').fadeIn(0).removeClass('show')
    $('.admin-login-page .login-forgot.show').fadeIn(0).removeClass('show')
    $('.admin-login-page .login-signin').fadeIn(200).addClass('show')

})

/* SHOW FORGOT*/
$(document).on('click', '.admin-login-page .show-forgot-form', function() {

    $('.admin-login-page .login-signin.show').fadeIn(0).removeClass('show')
    $('.admin-login-page .login-forgot').fadeIn(200).addClass('show')

})

/* SIGN-UP VALIDATION */

let status = []

/* fullnameCheck */
function signUpFullnameCheck() {

    $this = $('.admin-login-page .login-signup input[name="fullname"]')

    if($this.val() == ""){

        $this.removeClass('good-form')
        $this.addClass('bad-form')
        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Ad Soyad boş bırakılamaz.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Ad Soyad boş bırakılamaz.')
        }
        status.fullname = 0

    } else if($this.val().length <= 2){
        
        $this.removeClass('good-form')
        $this.addClass('bad-form')

        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Ad Soyad daha uzun olmalıdır.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Ad Soyad daha uzun olmalıdır.')
        }
        status.fullname = 0

    } else if($this.val().length >= 25){
        
        $this.removeClass('good-form')
        $this.addClass('bad-form')

        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Ad Soyad daha kısa olmalıdır.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Ad Soyad daha kısa olmalıdır.')
        }
        status.fullname = 0

    } else{
        $this.removeClass('bad-form')
        $this.addClass('good-form')

        !$this.parent('.form-group').children('.error-message').remove()
        status.fullname = 1
    }
}

/* emailCheck */
function signUpEmailCheck() {

    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $this = $('.admin-login-page .login-signup input[name="email"]')

    if($this.val() == ""){
        
        $this.removeClass('good-form')
        $this.addClass('bad-form')
        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Email boş bırakılamaz.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Email boş bırakılamaz.')
        }
        status.email = 0

    } else if (!regex.test($this.val())) {

        $this.removeClass('good-form')
        $this.addClass('bad-form')
        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Uygun bir Email giriniz.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Uygun bir Email giriniz.')
        }
        status.email = 0


    } else {
        $this.removeClass('bad-form')
        $this.addClass('good-form')

        !$this.parent('.form-group').children('.error-message').remove()
        status.email = 1

    }
}

/* passwordCheck */
function signUpPasswordCheck() {

    $this = $('.admin-login-page .login-signup input[name="password"]')

    if($this.val() == ""){
        
        $this.removeClass('good-form')
        $this.addClass('bad-form')
        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Şifre boş bırakılamaz.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Şifre boş bırakılamaz.')
        }
        status.password = 0

    } else if($this.val().length <= 6){
        
        $this.removeClass('good-form')
        $this.addClass('bad-form')
        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Şifre 6 karakterden uzun olmalıdır.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Şifre 6 karakterden uzun olmalıdır.')
        }
        status.password = 0

    } else {
        $this.removeClass('bad-form')
        $this.addClass('good-form')

        !$this.parent('.form-group').children('.error-message').remove()
        status.password = 1

    }

}

/* passwordAgainCheck */
function signUpPasswordAgainCheck() {

    let password = $('.admin-login-page .login-signup input[name="password"]')
    let passwordAgain = $('.admin-login-page .login-signup input[name="passwordAgain"]')
    $this = $('.admin-login-page .login-signup input[name="passwordAgain"]')

    if(passwordAgain.val() == ""){
        
        $this.removeClass('good-form')
        $this.addClass('bad-form')
        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Şifre tekrarı boş bırakılamaz.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Şifre tekrarı boş bırakılamaz.')
        }
        status.passwordAgain = 0

    } else if(passwordAgain.val().length <= 6){
        
        $this.removeClass('good-form')
        $this.addClass('bad-form')
        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Şifre tekrarı 6 karakterden uzun olmalıdır.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Şifre tekrarı 6 karakterden uzun olmalıdır.')
        }
        status.passwordAgain = 0

    } else if(!(password.val() == passwordAgain.val())){
        
        $this.removeClass('good-form')
        $this.addClass('bad-form')
        if(!$this.parent('.form-group').children('.error-message').length){
            $this.parent('.form-group').append('<p class="error-message" >Şifreler eşleşmiyor.</p>')
        } else {
            $this.parent('.form-group').children('.error-message').text('Şifreler eşleşmiyor.')
        }
        status.passwordAgain = 0

    } else {
        $this.removeClass('bad-form')
        $this.addClass('good-form')

        $this.parent('.form-group').children('.error-message').remove()
        status.passwordAgain = 1

    }

}

/* fullname-control */
$(document).on('keyup', '.admin-login-page .login-signup input[name="fullname"]', signUpFullnameCheck)

/* email-control */
$(document).on('keyup', '.admin-login-page .login-signup input[name="email"]', signUpEmailCheck)

/* password-control */
$(document).on('keyup', '.admin-login-page .login-signup input[name="password"]', signUpPasswordCheck)

/* passwordAgain-control */
$(document).on('keyup', '.admin-login-page .login-signup input[name="passwordAgain"]', signUpPasswordAgainCheck)

/* all inputs control */
$(document).on('keyup', '.admin-login-page .login-signup input', function() {

    if(status.fullname && status.email && status.password && status.passwordAgain){
        $('.admin-login-page .login-signup .sign-up-button').removeAttr('disabled')
    } else{
        $('.admin-login-page .login-signup .sign-up-button').prop('disabled', true)
    }

})

/* SIGN-UP TO ADMIN PANEL AJAX */
$(document).on('click', '.admin-login-page .sign-up-button', function(event) {

    if(status.fullname && status.email && status.password && status.passwordAgain){

        event.preventDefault()

        $this = $(this).closest('.login-signup')

        $.ajax({
            url: '/admin-kayit-ol',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                fullname: $this.find('input[name="fullname"]').val(),
                email: $this.find('input[name="email"]').val(),
                password: $this.find('input[name="password"]').val()
            }),
            success: function(res){
                
                if(res == 1){
                    alert('Kullanıcı Eklendi!')
                    $this.find('input').val('')
                    $this.find('input').removeClass('good-form')
                    $this.find('input').removeClass('bad-form')
                    $this.find('.error-message').remove()

                    $this.fadeOut(0).removeClass('show')
                    $('.admin-login-page').find('.login-signin').fadeIn(200).addClass('show')
                    
                } else if(res == 0){
                    alert('Kullanıcı Eklenemedi!')
                }

            },
            error: function(res){
                
                if(res == 0){
                    alert('Kullanıcı Eklenemedi!')
                } if(res == 1){
                    alert('Kullanıcı Eklendi!')
                }

            }

        })

    } else {
        alert('Kayıt olmadan önce bütün boşlukları uygun bir şekilde doldurmanız gerekmektedir.')
    }

})

/* SIGN-IN TO ADMIN PANEL AJAX */
$(document).on('click', '.admin-login-page .sign-in-button', function(event) {

    event.preventDefault()

    $this = $(this).closest('.login-signin')

    $.ajax({
        url: '/admin-giris-yap',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: $this.find('input[name="email"]').val(),
            password: $this.find('input[name="password"]').val()
        }),
        success: function(res){
            
            if(res.status == false){
                alert(res.message)
            } else {
                window.location.replace("/admin");
            }

        },
        error: function(res){
            
            if(res.status == false){
                alert(res.message)
            } else {
                window.location.replace("/admin");
            }

        }

    })

})

/* TECHNIC SERVICE DRONE EDIT AJAX */
$(document).on('click', '.technic-service-drone-edit-page .technic-service-drone-edit-button', function(event) {

    event.preventDefault()

    let serial = false
    let model = false
    let altModel = false

    if($('.technic-service-drone-edit-page input[name="droneModelName"]').val()) {
        altModel = true
    } else if ($('.technic-service-drone-edit-page input[name="droneSerialName"]').val()) {
        model = true
    } else {
        serial = true
    }

    $.ajax({
        url: '/admin/teknik-servis-drone-duzenle/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            serial: serial,
            model: model,
            altModel: altModel,
            _id: $('.technic-service-drone-edit-page input[name="_id"]').val(),
            name: $('.technic-service-drone-edit-page input[name="droneName"]').val(),
            seoText: CKEDITOR.instances.ckeditor.getData()
        }),
        success: function(res){

            if(res.status == true) {
                alert(res.message)
                window.location.replace("/admin/teknik-servis");
            } else {
                alert(res.message)
            }
            

        },
        error: function(res){

            if(res.status == true) {
                alert(res.message)
                window.location.replace("/admin/teknik-servis");
            } else {
                alert(res.message)
            }

        }

    })

})

/* BLOG EDIT PAGE AJAX */
$(document).on('click', '.blog-page .blog-page-edit-button', function(event) {

    event.preventDefault()

    $.ajax({
        url: '/admin/blog-sayfasi-duzenle/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            blogColumnType: $('.blog-page input[name="blogColumnType"]:checked').val(),
            blogMobileType: $('.blog-page input[name="blogMobileType"]:checked').val()
        }),
        success: function(res){

            if(res.status == true){
                alert(res.message)
            } else {
                alert(res.message)
            }

        },
        error: function(res){

            if(res.status == true){
                alert(res.message)
            } else {
                alert(res.message)
            }

        }

    })

})

/* ADD-BLOG AJAX*/
$(document).on('click', '.blog-add-page .blog-add-button', function(event) {

    event.preventDefault()

    $.ajax({
        url: '/admin/blog-ekle',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            Id: 0,
            url: $('.blog-add-page input[name="url"]').val(),
            title: $('.blog-add-page input[name="title"]').val(),
            description: $('.blog-add-page input[name="description"]').val(),
            keywords: $('.blog-add-page input[name="keywords"]').val(),
            author: $('.blog-add-page input[name="author"]').val(),
            bodyClass: 'inner-page navbar-backgrounded blog-post-page',
            blogTitle: $('.blog-add-page input[name="blogTitle"]').val(),
            blogText: CKEDITOR.instances.ckeditor.getData(),
            blogImage: $('.blog-add-page input[name="blogImage"]').val(),
            blogStatus: $('.blog-add-page input[name="blogStatus"]').prop('checked') ? 1 : 0,
            blogGeneralStatus: $('.blog-edit-page input[name="blogGeneralStatus"]').prop('checked') ? 1 : 0
        }),
        success: function(res){
            alert('Blog Eklendi!')
            window.location.replace("/admin/blog");
        },
        error: function(){
            alert('Blog Eklenemedi...');
        }

    })

})

/* EDIT-BLOG AJAX */
$(document).on('click', '.blog-edit-page .blog-edit-button', function(event) {

    event.preventDefault()

    $.ajax({
        url: '/admin/blog-duzenle/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            _id: $('.blog-edit-page input[name="_id"]').val(),
            url: $('.blog-edit-page input[name="url"]').val(),
            title: $('.blog-edit-page input[name="title"]').val(),
            description: $('.blog-edit-page input[name="description"]').val(),
            keywords: $('.blog-edit-page input[name="keywords"]').val(),
            author: $('.blog-edit-page input[name="author"]').val(),
            bodyClass: 'inner-page navbar-backgrounded blog-post-page',
            blogTitle: $('.blog-edit-page input[name="blogTitle"]').val(),
            blogText: CKEDITOR.instances.ckeditor.getData(),
            blogImage: $('.blog-edit-page input[name="blogImage"]').val(),
            blogStatus: $('.blog-edit-page input[name="blogStatus"]').prop('checked') ? 1 : 0,
            blogGeneralStatus: $('.blog-edit-page input[name="blogGeneralStatus"]').prop('checked') ? 1 : 0
        }),
        success: function(res){

            alert('Blog güncellendi')
            window.location.replace("/admin/blog");

        },
        error: function(){

            alert('Blog güncellenemedi');

        }

    })

})

/* REMOVE-BLOG AJAX */
$(document).on('click', '.blog-page .row-remove', function(event) {

    event.preventDefault()

    $this = $(this)
    const id = $this.attr('row-id')

    if(confirm('Blog silinecek. Onaylıyor musunuz?')){

        $.ajax({
            url: '/admin/blog-sil/'+id+'',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                _id: id
            }),
            success: function(res){
                $this.closest('tr').fadeOut(500, function() {$this.closest('tr').remove()})
            },
            error: function(){
                alert('Blog Silinemedi...');
            }
    
        })

    } 

})

/* EDIT-BLOG-STATUS AJAX */
$(document).on('click', '.blog-page .row-status-edit', function(event) {

    $this = $(this)
    const id = $this.attr('row-id')

    $.ajax({
        url: '/admin/blog-durum/'+id+'',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            _id: id
        }),
        success: function(res){

            if(res == "trued") {
                $this.prop('checked', true)
            } else {
                $this.prop('checked', false)
            }

        },
        error: function(){
            
        }

    })

})

/* EDIT-BLOG-GENERAL-STATUS AJAX */
$(document).on('click', '.blog-page .row-general-status-edit', function(event) {

    $this = $(this)
    const id = $this.attr('row-id')

    $.ajax({
        url: '/admin/blog-genel-durum/'+id+'',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            _id: id
        }),
        success: function(res){

            if(res == "trued") {
                $this.prop('checked', true)
            } else {
                $this.prop('checked', false)
            }

        },
        error: function(){
            
        }

    })

})

function refreshDocuments(directory, newDirectory){

    const documents = $('.documents-images-page').find('.documents')

    $.ajax({
        url: '/admin/gorseller',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            newDirectory: newDirectory
        }),
        success: function(res){

            if(res.status == true) {

                documents.find('.document-cover').remove()

                const allFiles = res.allFiles

                for (let i = 0; i < allFiles.length; i++) {

                    let newDocumentImage = ''

                    if(allFiles[i].typeClass == 'folder') {newDocumentImage = '<div class="document-image"><img src="/assets/img/documentation/folder.png" alt=""></div>'}
                    else if(allFiles[i].typeClass == 'image') {newDocumentImage = '<div class="document-image"><img src="'+allFiles[i].src+'" alt=""></div>'}
                    else if(allFiles[i].typeClass == 'psd') {newDocumentImage = '<div class="document-image"><img src="/assets/img/documentation/psd.png" alt=""></div>'}
                    
                    let newDocumentName = '<div class="document-name"><p>'+ allFiles[i].name +'</p></div>'

                    let newDocument = '<div class="document ' + allFiles[i].typeClass + '">'+ newDocumentImage + newDocumentName +'</div>'

                    let newDocumentCover = '<div class="document-cover">'+newDocument+'</div>'

                    documents.append(newDocumentCover)

                }

                directory.attr('src', res.newDirectory)

            } else {
                alert('başarısız')
            }

        }

    })

}

/* Show Document Popup Function */
function showDocumentPopup(documentName, documentSrc, documentHtml) {

    $('.documents-images-page .document-popup').find('.document-popup-image img').attr('src', documentSrc)
    $('.documents-images-page .document-popup').find('.document-popup-name input').val(documentName)
    $('.documents-images-page .document-popup').find('.document-popup-src input').val(documentSrc)
    $('.documents-images-page .document-popup').find('.document-popup-html input').val(documentHtml)

    $('.documents-images-page .document-popup').addClass('show')

}

/* Previous Directory */
$(document).on('click', '.documents-images-page .previousDirectory', function(){

    const directory = $('.documents-images-page').find('.directory')
    
    const arrayDirectory = directory.attr('src').split('/')
    arrayDirectory.splice(-2, 1)
    const newDirectory = arrayDirectory.join('/')
    
    refreshDocuments(directory, newDirectory)

})

/* Home Directory */
$(document).on('click', '.documents-images-page .homeDirectory', function(){

    const directory = $('.documents-images-page').find('.directory')
    
    const newDirectory = ''
    
    refreshDocuments(directory, newDirectory)

})

/* Refresh Directory */
$(document).on('click', '.documents-images-page .refreshDirectory', function(){

    const directory = $('.documents-images-page').find('.directory')
    
    const newDirectory = directory.attr('src')
    
    refreshDocuments(directory, newDirectory)

})

/* Double Click Checker */
let doubleClickTime = 0
function doubleClickChecker(){
    if (doubleClickTime == 0) {
        doubleClickTime = new Date().getTime();
        return false
    } else {
        if (((new Date().getTime()) - doubleClickTime) < 300) {
            doubleClickTime = 0;
            return true
        } else {
            doubleClickTime = new Date().getTime();
            return false
        }
    }
}

/* Double Click to Folder Open Folder*/
$(document).on('click', '.documents-images-page .document.folder', function(){

    if(doubleClickChecker()){

        const directory = $('.documents-images-page').find('.directory')
        const documentName = $(this).find('.document-name p').text()
        
        const newDirectory = directory.attr('src') + documentName + '/'
        
        refreshDocuments(directory, newDirectory)

    }

})

/* Double Click to Image Show Document Popup*/
$(document).on('click', '.documents-images-page .document.image', function(){

    if(doubleClickChecker()){

        const documentName = $(this).find('.document-name p').text()
        const documentSrc = $(this).find('.document-image img').attr('src')
        const documentHtml = '<img src="' + documentSrc + '" alt="' + documentName + '">' 

        showDocumentPopup(documentName, documentSrc, documentHtml)

    }

})

/* Close Document Popup Function */
$(document).on('click', '.documents-images-page .documents .document-popup-closer', function() {

    $('.document-popup').removeClass('show')

})

/* Select Document */
$(document).on('click', '.documents-images-page .document', function(){

    const thisDocument = $(this)
    const selectedDocuments = $('.documents-images-page .document.selected')

    if(!ctrlPressed){
        selectedDocuments.removeClass('selected')
    } 

    thisDocument.addClass('selected')

})

/* Multi Select Document When Press CTRL */
let ctrlPressed = false
$(document).on('keydown', function(event) {
    
    if(event.which == '17'){
        ctrlPressed = true
    }

})

$(document).on('keyup', function(event) {
    
    if(event.which == '17'){
        ctrlPressed = false
    }

})

/* Unselect Document When Click Outside */
$(document).on('click', '.documents-images-page', function(event){

    const selectedDocuments = $('.documents-images-page').find('.document.selected')

    if (!selectedDocuments.has(event.target).length) {
        selectedDocuments.removeClass('selected')
    }

})

$(document).on('click', '.documents-images-page .removeDocument', function() {

    const directory = $('.documents-images-page .directory')
    const newDirectory = directory.attr('src')

    let selectedDocuments = $('.documents-images-page .document.selected')

    let removeDocuments = []

    for (let i = 0; i < selectedDocuments.length; i++) {
        let nameSelectedDocuments = selectedDocuments.eq(i).find('.document-name p').text()
        removeDocuments[i] = '/assets/img/' + directory.attr('src') + nameSelectedDocuments 
    }

    $.ajax({
        url: '/admin/dosya-sil',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            removeDocuments: removeDocuments
        }),
        success: function(res){
            
            if(res.status == true){
                refreshDocuments(directory, newDirectory)
            } else {
                alert(res.message)
            }

        }
    })

})