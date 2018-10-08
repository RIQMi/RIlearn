function oc_add() {
    integer1 = document.getElementById("integer1");
    integer1.value.innerHTML = integer1.value++;
    productCount();
}
function oc_dec() {
    integer1 = document.getElementById("integer1");
    if(integer1.value>1){
        integer1.value.innerHTML = integer1.value--;
    }
    productCount();
}
function oc_amount() {
    var p = document.getElementById("oc_price").innerText;
    var v = document.getElementById("integer1").value;
    var t = p.replace(/^¥/i,'') * v;
    document.getElementById("oc_amount_money").innerHTML = ("¥" + t.toFixed(2)) ;
}
function om_add() {
    integer2 = document.getElementById("integer2");
    integer2.value.innerHTML = integer2.value++;
    productCount();
}
function om_dec() {
    integer2 = document.getElementById("integer2");
    if(integer2.value>1){
        integer2.value.innerHTML = integer2.value--;
    }
    productCount();
}
function om_amount() {
    var p = document.getElementById("om_price").innerText;
    var v = document.getElementById("integer2").value;
  /*  var t =116 * v;*/
    var t = p.replace(/^¥/i,'') * v;
    document.getElementById("om_amount_money").innerHTML =("¥" + t.toFixed(2)) ;
}
function removeRow(rowId) {
    var t = document.getElementById(rowId);
    t.remove();
}
function selectSame1(all,single) {
    var x = document.getElementById(all);
    var y = document.getElementsByClassName(single);
    for(var i=0;i<y.length;i++){
        if(x.checked){
            y[i].checked = true;
        }else {
            y[i].checked = false;
        }
    }
    productCount();
}
function selectSame2(all,single) {
    var x = document.getElementById(all);
    var y = document.getElementsByClassName(single);
    var count = 0;
    for(var i = 0;i<y.length;i++){
        if(y[i].checked){
            count++;
        }
            if(count === y.length){
                x.checked = true;
                selectSame1();
            }else {
                x.checked = false;
            }
    }
    productCount();

}
function selectAll(x,y) {
    var checkAllInputs = document.getElementsByClassName("check_all");
    var checkInputs = document.getElementsByName("check");
        for(var j = 0;j<checkInputs.length;j++){
            checkAllInputs[x].checked = checkAllInputs[y].checked;
            checkInputs[j].checked = checkAllInputs[0].checked;
        }
        productCount();
}


function selectSingle() {
    var checkAllInputs = document.getElementsByClassName("check_all");
    var checkInputs = document.getElementsByName("check");
    var count = 0;
    for(var i = 0;i<checkInputs.length;i++){
        if(checkInputs[i].checked){
            count++;
        }
        console.log(count);
        for(var j = 0;j<checkAllInputs.length;j++){
            if(count === checkInputs.length){
                checkAllInputs[j].checked = true;
            }else {
                checkAllInputs[j].checked = false;
            }
        }
    }
}




function productCount() {
    var checkInputs = document.querySelectorAll('input[cc]');
    var total = 0;
    var count = 0;
    for(i=0;i<checkInputs.length;i++){
        var price = 0;
        var nums = 0;
        if(checkInputs[i].checked){
            var c = checkInputs[i].parentNode.parentNode;
            price = c.childNodes[7].innerHTML;
            nums = c.childNodes[9].childNodes[2].value;
            var p = price.replace(/^¥/i,'');
            total += p * nums;
            count++;
        }else {
            total += 0;
        }
    }
    document.querySelector('span[aa]').innerHTML =  ("¥" + total.toFixed(2));
    document.querySelector('span[bb]').innerHTML = (count);
    document.getElementById("balance").style.backgroundColor = "orange";
}

