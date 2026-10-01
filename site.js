(function(){
  // "há 5 minutos"
  function quando(ts){var s=Math.max(0,Date.now()/1000-ts);
    if(s<60)return"agora";if(s<3600)return"há "+Math.floor(s/60)+" min";
    if(s<86400)return"há "+Math.floor(s/3600)+"h";var d=Math.floor(s/86400);return"há "+d+(d>1?" dias":" dia");}
  document.querySelectorAll(".quando[data-ts]").forEach(function(e){e.textContent=quando(+e.dataset.ts)});
  // copiar cupom
  document.addEventListener("click",function(ev){var b=ev.target.closest("[data-copiar]");if(!b)return;
    ev.preventDefault();var t=b.dataset.copiar;
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){
      var i=document.createElement("input");i.value=t;document.body.appendChild(i);i.select();document.execCommand("copy");i.remove();});
    var h=b.innerHTML;b.textContent="COPIADO ✓";b.classList.add("ok");setTimeout(function(){b.innerHTML=h;b.classList.remove("ok")},1800);});
  // filtros da página inicial (?loja=, ?cat=, ?q=)
  var grade=document.getElementById("grade");if(!grade)return;
  var p=new URLSearchParams(location.search),f={loja:p.get("loja")||"",cat:p.get("cat")||"",q:(p.get("q")||"").toLowerCase()};
  var campo=document.querySelector(".busca input");if(campo)campo.value=p.get("q")||"";
  function sem(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}
  function aplicar(){var n=0,q=sem(f.q);
    grade.querySelectorAll(".card").forEach(function(c){var ok=(!f.loja||c.dataset.loja===f.loja)&&(!f.cat||c.dataset.cat===f.cat)
      &&(!q||q.split(/\s+/).every(function(w){return sem(c.dataset.busca).indexOf(w)>=0}));c.classList.toggle("hide",!ok);if(ok)n++;});
    document.getElementById("vazio").classList.toggle("hide",n>0);
    document.getElementById("limpar").classList.toggle("hide",!(f.loja||f.cat||f.q));
    document.querySelectorAll(".chip").forEach(function(b){b.classList.toggle("on",f[b.dataset.f]===b.dataset.v)});
    var u=new URLSearchParams();if(f.loja)u.set("loja",f.loja);if(f.cat)u.set("cat",f.cat);if(f.q)u.set("q",f.q);
    history.replaceState(null,"",location.pathname+(u.toString()?"?"+u:""));}
  document.querySelectorAll(".chip").forEach(function(b){b.addEventListener("click",function(){
    f[b.dataset.f]=f[b.dataset.f]===b.dataset.v?"":b.dataset.v;aplicar();grade.scrollIntoView({behavior:"smooth",block:"start"});});});
  document.getElementById("limpar").addEventListener("click",function(){f={loja:"",cat:"",q:""};if(campo)campo.value="";aplicar();});
  if(campo){campo.form.addEventListener("submit",function(e){e.preventDefault();f.q=campo.value.trim().toLowerCase();aplicar();});
    campo.addEventListener("input",function(){f.q=campo.value.trim().toLowerCase();aplicar();});}
  aplicar();
})();
