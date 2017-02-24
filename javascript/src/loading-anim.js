var c = document.querySelector(".loading__anim");
c.width = 1920;
c.height = 1080;
var S = Math.sin;
var C = Math.cos;
var T = Math.tan;
var R = function(r,g,b,a) {
    a = a === undefined ? 1 : a;
    return "rgba("+(r|0)+","+(g|0)+","+(b|0)+","+a+")";
};

var x = c.getContext("2d");
    

var time = 0;
var frame = 0;

function u(t) {
    
    r=400;c.width=r*4;λ=0;for(φ=a=Math.PI/2;φ>-a;φ-=1/r){λ+=a;x.lineTo(C(φ)*S(λ-t)*r+2*r,(C(t=t+1/r)*S(φ)+S(t)*C(φ)*C(λ-t))*r+r)}
    x.strokeStyle="#ffffff";
    x.stroke();
}

function loop() {
    requestAnimationFrame(loop);
    time = frame/60;
    if(time * 60 | 0 === frame - 1){
      time += 0.000001;
    }
    frame++;
    u(time);
}

loop();
