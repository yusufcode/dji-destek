/* TECHNIC-SERVICE SEND MESAGE */
document.querySelector('.technic-service-page button[type="submit"]').onclick = function(){

    let {droneSerial,droneModel,droneAltModel} = ''
    if(document.querySelector('.technic-service-page .droneSerial')){
        droneSerial = document.querySelector('.technic-service-page .droneSerial').value
    } if(document.querySelector('.technic-service-page .droneModel')){
        droneModel = document.querySelector('.technic-service-page .droneModel').value
    } if(document.querySelector('.technic-service-page .droneAltModel')){
        droneAltModel = document.querySelector('.technic-service-page .droneAltModel').value
    }

    const problemTitle = document.querySelector('.technic-service-page .problemTitle').value
    const problemDesc = document.querySelector('.technic-service-page .problemDesc').value
    const costomerName = document.querySelector('.technic-service-page .costomerName').value
    const costomerNumber = document.querySelector('.technic-service-page .costomerNumber').value
    const costomerEmail = document.querySelector('.technic-service-page .costomerEmail').value

    AjaxTechnicService(droneSerial,droneModel,droneAltModel,problemTitle,problemDesc,costomerName,costomerNumber,costomerEmail)

}

function AjaxTechnicService(droneSerial,droneModel,droneAltModel,problemTitle,problemDesc,costomerName,costomerNumber,costomerEmail){

    const ajax = new XMLHttpRequest()
    ajax.open('POST', '/teknik-servis', true)
    ajax.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    ajax.send(JSON.stringify({droneSerial,droneModel,droneAltModel,problemTitle,problemDesc,costomerName,costomerNumber,costomerEmail}))
    ajax.onreadystatechange = handleRequestStateChange

    function handleRequestStateChange(){
        if(ajax.readyState == 4 && ajax.status == 200){
            const response = JSON.parse(ajax.response)

            if(response.status == false){
                alert(response.message)
            } else{
                alert(response.message)
                location.replace('/')
            }
        }
    }
    
}