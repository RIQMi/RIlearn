<template>
  <div class="Login"  :style="loginbg">
    <div v-if="skin" class="skin" title="皮肤管理" @click="subjectShow()"></div>
    <div class="divMove" :style="divremove" :class="modulemove">
      <div class="topMove">
        <span class="bgchange">背景切换</span>
        <span class="bgclose">
          <img :src="`${assets}/img/login/bgclose.png`" @click="subjectHide()">
        </span>
      </div>
      <div class="layer">
        <div class="nav_information">
           <div v-for="(value,index) in ticks" :key="index" class="chimage">
            <img :src="value.bg" @click="changeImage(index+1)">
            <div class="tick" :style="{display:value.active?'block':'none'}"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="login">
      <div class="login_bg">
        <div class="loginForm">
          <form>
            <div class="logincontent">
              <div class="logo"></div>
              <div class="login_bar">
                <div class="login-type">
                  <div class="user-login">
                    <img :src="`${assets}/img/login/${myLoginType==2?'useron.png':'user.png'}`" @click="loginByUser()">
                  </div>
                  <div v-show="phone" class="phone-login">
                    <img :src="`${assets}/img/login/${myLoginType==1?'phoneon.png':'phone.png'}`" @click="loginByPhone()">
                  </div>
                </div>
                <div>
                  <input type="text" class="username" autocomplete="username" maxlength="20" tabindex="1" v-model="username">
                </div>
                <div>
                  <input :type="inputType" class="password" autocomplete="new-password" maxlength="20" tabindex="2" v-model="password">
                </div>
                <div :style="codeDiv" style="margin:5px 0px 10px -160px;color:#fff" >
                  <div class="codeHref" >
                    <span v-show='sendAuthCode' @click="CheckFormByPhone()" class="auth_text">获取手机验证码</span>
                    <span v-show='!sendAuthCode' style="margin-left: 55px;">{{auth_time}}秒后重新发送验证码</span>
                  </div>
                </div>  
                <div :style="remember" style="margin:5px 0px 10px -160px;color:#fff;padding:5px 0;">
                  <input type="checkbox" class="checkbox" v-model="checked" >
                  记住密码
                  <br/>
                </div>
                <div>
                  <button tabindex="4" class="sub" @click="btnSubmit()"></button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import crypto from "crypto";
export default {
  data() {
    return {
      skin: true,
      phone: true,
      myLoginType: 2,
      sendAuthCode: true,
      auth_time: 0,
      sid: -99,
      divremove: {
        display: "none"
      },
      modulemove: "module-move",
      btnSms: "获取短信验证码",
      username: "",
      password: "",
      checked: false,
      inputType: "password",
      LoginObject: {
        login01: true,
        login02: false,
        login03: false
      },
      loginbg: {
        background: `url('${T.assets}/img/login/bg01.jpg') no-repeat`,
        'background-size': '100% 100%'
      },
      ticks: [
        {
          active: true,
          bg: `${T.assets}/img/login/bg01.jpg`
        },
        {
          active: false,
          bg: `${T.assets}/img/login/bg02.jpg`
        },
        {  
          active: false,
          bg: `${T.assets}/img/login/bg03.jpg`
        }
      ],
      codeDiv: {
        display: "none"
      },
      remember: {
        display: "block"
      }
      // InterValObj:''
      // token:''
    };
  },
  mounted: function() {
    var IsRememberUser = this.getCookie("IsRememberUser");
    var username = this.getCookie("username");
    var password = this.getCookie("password");
    if (IsRememberUser != "undefined" &&username != "undefined" && password != "undefined") {
      this.username = username;
      this.password = password;
      this.checked = (IsRememberUser=="1"?true:false);
    }
  },
  methods: {
    subjectShow() {
      this.divremove.display = "block";
    },
    subjectHide() {
      this.divremove.display = "none";
    },
    //换肤
    changeImage(x) {
      this.loginbg.background = `url('${this.ticks[x - 1].bg}') 0% 0% / 100% 100% no-repeat`;
      for (let i = 0; i < this.ticks.length; i++) {
        if (i == x - 1) {
          this.ticks[i].active = true;
        } else {
          this.ticks[i].active = false;
        }
      }
    },
    btnSubmit() {
      var userName = this.username;
      var passWord = this.password;
      if (this.myLoginType == 1) {
        if (userName == null || userName == "") {
          alert("请输入手机号码");
          return;
        }
        if (passWord == null || passWord == "") {
          alert("请输入验证码");
          return;
        }
        this.JsySmsCode();
      } else {
        if (userName == null || userName == "") {
          alert("请输入用户名或手机号码");
          return;
        }
        if (passWord == null || passWord == "") {
          alert("请输入密码");
          return;
        }
        this.AjaxLogin();
      }
    },
    //手机登录
    JsySmsCode() {
      T.ajax({
        method: "POST",
        url: "/Login/AjaxHandler/SmsLogin.ashx?r=" + Math.random(),
        dataType: "json",
        data:{
          flag:"SubmitSmsCode",
          username:this.username,
          passWord:this.password,
          SID:this.sid
        },
        f:"text",
        success: function(msg) {
          if (msg.code == "1") {
            window.location.href = T.vm.$store.state.mainpage;
          } else {
            alert("短信验证码错误，请重新输入！");
          }
        },
        error: function() {}
      });
    },
    //用户名登录
    AjaxLogin() {
      var userName = this.username;
      var passWord = this.password;
      var IsRememberUser = this.checked?"1":"0";
      if (passWord.length != 32) {
        passWord = this.getmd5(passWord);
      }
      console.log("正在请求登录....");
      T.ajax({
        method: "POST",
        url: "/Login/login.ashx",
        data: {
          type: 1,
          username: userName,
          passWord: passWord,
          IsRememberUser: IsRememberUser
        },
        f: "text",
        success: function(msg) {
          console.log(msg);  
          if (msg == "false") {
            alert("用户名或密码错误，请重新输入！");
          } else if (msg == "restart") {
            alert("当前已有用户在线，正在处理...");
            setTimeout("AjaxLogin()", 3000);
          } else {
            console.log("请求跳转中地址："+T.vm.$store.state.mainpage);
            //alert(T.vm.$store.state.mainpage);
            window.location.href = T.vm.$store.state.mainpage;
          }
        },
        error: function(request) {
          alert("用户名或密码错误，请重新输入！");
        }
      });
      console.log("正在请求登录中....");
    },
    //验证手机号码
    CheckFormByPhone() {
      var userName = this.username;
      var passWord = this.password;
      if (userName == null || userName == "") {
        alert("请输入手机号码！");
        return false;
      }
      if (/^1[345789]\d{9}$/.test(userName) == true) {
        this.getSmsCode();
      } else {
        alert("请输入有效的手机号码！");
        return false;
      }  
    },
    //获取短信验证码
    getSmsCode() {
      T.ajax({
        method: "POST",
        f: "html",
        url: "/Login/AjaxHandler/SmsLogin.ashx?r=" + Math.random(),
        data:{
          flag:"GetVerificationCode",
          phone: this.username,
          title:T.vm.$store.state.msgtitle
        }, 
        success: data => {
          var response = eval("(" + data + ")");
          if (response[0] == "验证码已发至手机，请注意查收!") {
            alert(response[0]);
            // this.sendMessageJS(this.username,response[1])
            this.sendAuthCode = false;
            this.auth_time = 120;
            this.sid = response[1];
            var auth_timetimer = setInterval(() => {
              this.auth_time--;
              if (this.auth_time <= 0) {
                this.sendAuthCode = true;
                clearInterval(auth_timetimer);
              }
            }, 1000);
          } else {
            alert(response[0]);
          }
        },
        error: function(request) {}
      });
    },
    //md5加密
    getmd5(str) {
      var md5 = crypto.createHash("md5");
      md5.update(str);
      return md5.digest("hex");
    },
    //获取cookie
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    },

    //切换到用户登录
    loginByUser() {
      this.username = "";
      this.password = "";
      this.remember.display = "block";
      this.codeDiv.display = "none";
      this.inputType = "password";
      this.myLoginType = 2;
    },
    //切换到手机登录
    loginByPhone() {
      this.username = "";
      this.password = "";
      this.remember.display = "none";
      this.codeDiv.display = "block";
      this.inputType = "text";
      this.myLoginType = 1;
    }
  },
  created() {
    let { skin, phone } = this.$route.query;
    if ((skin = 0)) {
      this.skin = false;
    }
    if ((phone = 0)) {
      this.phone = false;
    }
  }
};
</script>


<style>
.Login {
  width: 100%;
  height: 100%;
  overflow:hidden;
}
.skin {
  width: 32px;
  height: 32px;
  float: right;
  margin: 20px 30px;
}
.divMove {
  float: right;
  z-index: 999;
  position: absolute;
  top: 50px;
  right: 66px;
}
.module-move {
  position: absolute;
  width: 368px;
  border-radius: 3px;
  margin: 0 auto;
  background: #293d59;
  background-color: rgba(41, 61, 89, 0.85);
}
.topMove {
  width: 100%;
  height: 40px;
  line-height: 40px;
  cursor: move;
}
.topMove span {
  font-size: 16px;
  margin-left: 20px;
}
.bgchange {
  float: left;
  color: #fff;
}
.bgclose {
  float: right;
  margin-right: 10px;
}
.bgclose img {
  cursor: pointer;
}
.layer {
  margin: 0 7px 7px 7px;
  background-color: #fff;
  overflow: hidden;
}
.right {
  width: 100%;
  font-size: 12px;
  text-align: left;
}
.chimage {
  margin: 10px 0px 10px 15px;
  float: left;
}
.chimage img {
  cursor: pointer;
  width: 96px;
  height: 54px;
}

.login {
  margin-left: auto;
  background-position: 0 0 0 0;
  height: 90%;
  margin-right: auto;
  width: 1000px;
  text-align: center;
}
.login .login_bg {
  text-align: center;
  vertical-align: middle;
  margin-left: auto;
  margin-right: auto;
  width: 790px;
  height: 464px;
  margin-top: 200px;
}
.login .loginForm {
  display: block;
  margin: auto;
}
form {
  display: block;
  margin-top: 0em;
}
.logincontent {
  width: 790px;
  height: 464px;
  text-align: center;
  vertical-align: middle;
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
}
.logo {
  width: 790px;
  height: 84px;
}
.login .login_bar {
  width: 438px;
  height: 355px;
  margin: 0 auto;
}
.login .username,
.password {
  width: 245px;
  height: 34px;
  font-size: 22px;
  border: none;
  background: none;
  margin-left: 30px;
  color: #000;
}
.login_bar .username {
  margin-top: 7px;
}
.login_bar .password {
  margin-top: 18px;
}
.checkbox {
  vertical-align: middle;
  width: 15px;
  height: 15px;
  display: inline-block;
  margin-right: 2px;
  cursor: pointer;
  margin-left: -26px;
}
.codeHref {
  padding: 5px 0;
}
.sub {
  font-size: 22px;
  color: #ffffff;
  margin-left: -38px;
  display: block;
  width: 283px;
  height: 47px;
  border: none;
  cursor: pointer;
  float: left;
  margin-left: 75px;
}
.login-type {
  float: left;
  margin-top: 54px;
  margin-left: 93px;
  width: 270px;
  height: 52px;
  cursor: pointer;
}
.user-login,
.phone-login {
  width: 35%;
  height: 50%;
  float: left;
}
.phone-login {
  margin-left: 51px;
}
a:link,
a:visited,
a:hover,
a:active {
  font-family: "Microsoft YaHei";
  font-size: 16px;
  color: #fff;
  text-align: center;
  text-decoration: underline;
}
.tick {
  width: 24px;
  height: 24px;
  margin-top: -24px;
  margin-left: 72px;
  position: absolute;
}
.auth_text {
  text-decoration: underline;
  cursor: pointer;
}
</style>

