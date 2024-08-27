/* qr login */
;function QRLogin(host){
this.version='1.0.0';
this.id='qrcode';
this.host=host||'';
this.ui=null;
/* initialize */
this.init=async function(){
  /* check current app data */
  let app=this.appData();
  if(app){
    /* prepare user data */
    this.userData(this.parseJSON(app.userdata),app.appname);
    /* do something with abl.js */
    new abl(app.appname,app.apphost);
    /* stop here */
    return;
  }
  /* load basic ui */
  this.ui=this.basicUI();
  /* take a new otp */
  let otp=this.take();
  /* poke an otp to the server host */
  return await this.poke(otp);
};
/* give data */
this.give=async function(otp,data){
  data=typeof data==='object'&&data!==null?data:{
    appname:'',
    apphost:'',
    token:'',
    userdata:'',
  };
  let query='&data='+btoa(JSON.stringify(data)),
  res=await fetch(this.host+'?give='+otp+query,{mode:'cors'})
    .then(r=>r.text()),
  parsed=this.parseJSON(res);
  if(typeof parsed==='object'&&parsed!==null){
    return parsed;
  }
  return false;
};
/* poke an otp */
this.poke=async function(otp='',attempt=0){
  attempt++;
  let data=await fetch(this.host+'?poke='+otp,{mode:'cors'})
    .then(r=>r.text()),
  res=this.parseJSON(data);
  if(typeof res==='object'&&res!==null
    &&res.hasOwnProperty('token')
    &&res.hasOwnProperty('userdata')
    &&res.hasOwnProperty('appname')
    &&res.hasOwnProperty('apphost')
    ){
    this.appData(res);
    this.loader();
    return await this.init();
  }else if(attempt<0x63){
    return setTimeout(async ()=>{
      return await this.poke(otp,attempt);
    },0x3e8);
  }else{
    this.put('Error: Failed to get application data!');
    return false;
  }
};
/* take a new otp */
this.take=function(){
  this.put();
  let otp=this.uniqid('otp_');
  new QRCode(this.id,{
    text:otp,
    width:200,
    height:200,
    colorDark:"#000000",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.H
  });
  return otp;
};
/* loader image element */
this.loader=function(){
  let img=new Image;
  img.alt='Loading...';
  img.src=this.loaderURL();
  this.put(img);
  return img;
};
/* put on body */
this.put=function(el=''){
  if(this.ui){
    this.ui.body.innerHTML='';
    this.ui.body.append(el);
  }else{
    let body=document.getElementById('qrcode');
    if(body){
      body.innerHTML='';
      body.append(el);
    }
  }
  return el;
};
/* basic ui */
this.basicUI=function(){
  let style=document.createElement('style'),
  particle=document.createElement('div'),
  login=document.createElement('div'),
  header=document.createElement('div'),
  body=document.createElement('div'),
  footer=document.createElement('div');
  login.classList.add('login');
  header.classList.add('header');
  body.classList.add('body');
  footer.classList.add('footer');
  header.dataset.text='LoginQR';
  body.id=this.id;
  footer.dataset.text='Powered by 9r3i';
  particle.id='particles';
  style.textContent=this.styleText();
  style.media='screen';
  document.body.innerHTML='';
  document.head.append(style);
  document.body.append(particle);
  document.body.append(login);
  login.append(header);
  login.append(body);
  login.append(footer);
  particle.style.height=window.innerHeight+'px';
  particle.style.width=window.innerWidth+'px';
  window.addEventListener('resize',()=>{
    particle.style.height=window.innerHeight+'px';
    particle.style.width=window.innerWidth+'px';
  });
  this.particle();
  return {
    particle,
    login,
    header,
    footer,
    body,
  };
};
/* particle.js */
this.particle=function(){
  particlesJS('particles',{
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "random"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 1,
          "color": "random"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.7,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.2,
          "sync": true
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 9,
          "size_min": 0.1,
          "sync": true
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#555",
        "opacity": 0.5,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": true,
          "rotateX": 800,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 100
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": true,
      "background_color": "#333333",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  });
};
/* loader url -- stand-alone */
this.loaderURL=function(){
  return 'data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH5BAkLAAAAIf4aQ3JlYXRlZCB3aXRoIGFqYXhsb2FkLmluZm8AIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7';
};
/* user data -- stand-alone */
this.userData=function(ndata,appname=''){
  let key=appname+'-user',
  res=false;
  if(ndata===false){
    localStorage.removeItem(key);
    return true;
  }else if(typeof ndata==='object'&&ndata!==null){
    let dataString=JSON.stringify(ndata);
    localStorage.setItem(key,dataString);
    return true;
  }
  let data=localStorage.getItem(key);
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }
  return res;
};
/* app data -- stand-alone */
this.appData=function(ndata){
  let key='app-data',
  res=false;
  if(ndata===false){
    localStorage.removeItem(key);
    return true;
  }else if(typeof ndata==='object'&&ndata!==null){
    let dataString=JSON.stringify(ndata);
    localStorage.setItem(key,dataString);
    return true;
  }
  let data=localStorage.getItem(key);
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }
  return res;
};
/* parse json */
this.parseJSON=function(data=''){
  let res=false;
  try{
    res=JSON.parse(data);
  }catch(e){
    res=false;
  }
  return res;
};
/* generate uniqid -- stand-alone */
this.uniqid=function(prefix){
  return (typeof prefix==='string'?prefix:'') 
    +(Math.random()*Math.pow(0x0a,0x14)).toString(0x24)
    +(new Date).getTime().toString(0x24);
};
/* style.css -- stand-alone */
this.styleText=function(){
  return `/* reset */
*,*:before,*:after{
  -webkit-box-sizing:border-box;
  -moz-box-sizing:border-box;
  -o-box-sizing:border-box;
  box-sizing:border-box;
  font-family:system-ui,sans-serif;
  -webkit-user-select:none;
  -moz-user-select:none;
  -o-user-select:none;
  -ms-user-select:none;
  user-select:none;
  outline:none;
}
body{
  margin:0px;
  padding:0px;
  font-family:system-ui,sans-serif;
  overflow:hidden;
  background-color:#2b2b2b;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  min-height:600px;
  height:calc(100%);
  width:calc(100%);
}
/* particles */
#particles{
  margin:0px;
  padding:0px;
  width:100%;
  height:100%;
  background-color:#191919;
  background-image:url('');
  background-size:cover;
  background-position:50% 50%;
  background-repeat:no-repeat;
  position:absolute;
  z-index:1;
  top:0px;
  bottom:0px;
  left:0px;
  right:0px;
}
/* login */
.login{
  margin:0px;
  padding:0px;
  position:absolute;
  z-index:3;
  width:350px;
  height:auto;
  background-color:rgba(50,100,155,0.6);
  box-shadow:0px 0px 15px #59d;
  border:0px none;
  border-radius:9px;
  overflow:hidden;
}
.login .header{
  font-size:24px;
  font-weight:bold;
  color:#fff;
  text-align:center;
  margin:0px;
  padding:25px 10px 15px;
}
.login .header:before{
  content:attr(data-text);
}
.login .body{
  width:220px;
  height:220px;
  margin:0px auto;
  padding:10px;
  background-color:#fff;
  box-shadow:inset 0px 0px 9px #333;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  color:#555;
}
.login .footer{
  font-size:13px;
  text-align:center;
  color:#fff;
  margin:0px;
  padding:15px 10px 30px;
}
.login .footer:before{
  content:attr(data-text);
}
`;
};
};
