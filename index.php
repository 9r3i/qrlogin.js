<?php
new QRLogin;
?>
<!DOCTYPE html><html lang="en-US" dir="ltr"><head>
  <meta http-equiv="content-type" content="text/html;charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <title>9r3i\QRLogin</title>
  <meta name="keywords" content="9r3i, niner, qrlogin" />
  <meta name="description" content="the sly eagle doesn't kill at whim" />
  <meta name="robots" content="follow,index" />
  <meta name="author" content="9r3i" />
  <meta name="uri" content="https://github.com/9r3i" />
  <link rel="icon" href="https://raw.githubusercontent.com/9r3i/hotelbandara/master/images/logo.png" type="image/png" />
  <script id="virtual.js"></script>
</head><body>
<span>Connecting...</span>
<script>
/* anonymous async function */
(async function(){
  /* prepare registered files */
  const REGISTERED_FILES={
    "abl.js": "https://raw.githubusercontent.com/9r3i/abl.js/master/abl.min.js",
    "particle.js": "https://raw.githubusercontent.com/VincentGarreau/particles.js/master/particles.min.js",
    "qrcode.js": "https://raw.githubusercontent.com/9r3i/qrlogin.js/master/qrcode.min.js",
    "qrlogin.js": "https://raw.githubusercontent.com/9r3i/qrlogin.js/master/qrlogin.js",
  };
  /* virtual host file */
  const VIRTUAL_HOST="https://raw.githubusercontent.com/9r3i/virtual.js/master/virtual.min.js";

  /* standard virtual initialization -- do not change */
  let vname='virtual.js',
  vtag=document.getElementById(vname),
  vscript=localStorage.getItem('virtual/'+vname);
  if(!vscript){
    vscript=await fetch(VIRTUAL_HOST).then(r=>r.text());
    if(!vscript.match(/function\svirtual/)){
      alert('Error: Failed to load virtual.js');
      return;
    }
  }
  /* execute the virtual script */
  vtag.textContent=vscript;
  /* initialize virtual.js with registered files */
  const vapp=new virtual(REGISTERED_FILES);
  /* save virtual script */
  vapp.put(vname,vscript);
  /* load abl file */
  await vapp.load('abl.js');
  /* load particle.js */
  await vapp.load('particle.js');
  /* load qrcode.js */
  await vapp.load('qrcode.js');
  /* load qrlogin.js */
  await vapp.load('qrlogin.js');
  /* load qrlogin */
  const app=new QRLogin;
  app.init();
})();
</script>
</body></html>
<?php
class QRLogin{
  const appns='otp';
  const version='1.0.0';
  private $dir='otp/';
  public function __construct(){
    /* prepare directory */
    if(!is_dir($this->dir)){
      @mkdir($this->dir,0777,true);
    }
    /* set get poke and give */
    if(isset($_GET['poke'])){
      return $this->poke($_GET['poke']);
    }elseif(isset($_GET['give'],$_GET['data'])){
      return $this->give($_GET['give'],$_GET['data']);
    }
    /* set error request if doesnt have any get request */
    if(count($_GET)>0){
      return $this->result('error:request');
    }
  }
  private function poke(string $otp=''){
    $file=$this->dir.$otp;
    if(!is_file($file)){
      return $this->result('error:empty');
    }
    $json=file_get_contents($file);
    @unlink($file);
    $data=@json_decode($json,true);
    return $this->result($data);
  }
  private function give(string $otp='',string $base=''){
    if($otp==''){
      return $this->result('error:empty');
    }
    $file=$this->dir.$otp;
    if(is_file($file)){
      return $this->result('error:sent');
    }
    $json=base64_decode($base);
    $put=file_put_contents($file,$json);
    return $this->result($put);
  }
  private function result($data){
    $json=@json_encode($data);
    if(!headers_sent()){
      header('content-type:text/plain');
      header('content-length:'.strlen($json));
    }
    exit($json);
  }
}
