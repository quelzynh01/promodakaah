(function(){
  var $=function(s){return document.querySelector(s)};
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
  // menu lateral e busca (celular)
  var gav=$("#gaveta"),busca=$("#busca"),campo=busca&&busca.querySelector("input");
  function menu(on){gav.classList.toggle("on",on);document.documentElement.classList.toggle("travado",on)}
  if($("#abrirMenu"))$("#abrirMenu").onclick=function(){menu(true)};
  if($("#fecharMenu"))$("#fecharMenu").onclick=function(){menu(false)};
  if(gav)gav.addEventListener("click",function(e){if(e.target===gav||e.target.closest(".gaveta-menu a"))menu(false)});
  function abrirBusca(){busca.classList.add("on");campo.focus()}
  if($("#abrirBusca"))$("#abrirBusca").onclick=function(){busca.classList.contains("on")?busca.classList.remove("on"):abrirBusca()};

  var grade=document.getElementById("grade");
  document.querySelectorAll("[data-busca]").forEach(function(a){if(a.tagName==="A"&&grade)a.addEventListener("click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});abrirBusca();})});
  if(!grade)return;

  // filtros / ordem / "carregar mais" da página inicial
  var POR_PAG=23,mostrar=POR_PAG;
  var p=new URLSearchParams(location.search);
  var f={loja:p.get("loja")||"",cat:p.get("cat")||"",q:(p.get("q")||"").toLowerCase(),ordem:p.get("ordem")||"recentes"};
  if(campo)campo.value=p.get("q")||"";
  if(p.get("buscar"))setTimeout(abrirBusca,50);
  var sel=$("#ordem");sel.value=f.ordem;
  var itens=[].slice.call(grade.children);
  function sem(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}
  function aplicar(rolar){var q=sem(f.q),vis=[];
    var ord=itens.slice().sort(function(a,b){var A=a.dataset,B=b.dataset;
      if(f.ordem==="desconto")return(+B.desc)-(+A.desc)||(+B.ts)-(+A.ts);
      if(f.ordem==="menor")return((+A.preco)||1e9)-((+B.preco)||1e9);
      if(f.ordem==="maior")return(+B.preco)-(+A.preco);return(+B.ts)-(+A.ts);});
    ord.forEach(function(c){grade.appendChild(c);var d=c.dataset;
      var ok=(!f.loja||d.loja===f.loja)&&(!f.cat||d.cat===f.cat)&&(!q||q.split(/\s+/).every(function(w){return sem(d.busca).indexOf(w)>=0}));
      if(ok)vis.push(c);c.classList.add("hide");});
    vis.slice(0,mostrar).forEach(function(c){c.classList.remove("hide")});
    $("#vazio").classList.toggle("hide",vis.length>0);
    $("#maisBtn").classList.toggle("hide",vis.length<=mostrar);
    $("#contagem").textContent=vis.length>POR_PAG?("Página "+Math.ceil(Math.min(mostrar,vis.length)/POR_PAG)+" de "+Math.ceil(vis.length/POR_PAG)):"";
    $("#limpar").classList.toggle("hide",!(f.loja||f.cat||f.q));
    $("#titLista").textContent=f.q?('Resultados: "'+f.q+'"'):"Ofertas Recentes";
    document.querySelectorAll(".chip").forEach(function(b){var on=b.dataset.f==="todas"?!(f.loja||f.cat):f[b.dataset.f]===b.dataset.v;b.classList.toggle("on",on)});
    document.querySelectorAll(".atalho").forEach(function(b){b.classList.toggle("on",!!((b.dataset.f&&f[b.dataset.f]===b.dataset.v)||(b.dataset.ordem&&f.ordem===b.dataset.ordem)))});
    var u=new URLSearchParams();["loja","cat","q"].forEach(function(k){if(f[k])u.set(k,f[k])});if(f.ordem!=="recentes")u.set("ordem",f.ordem);
    history.replaceState(null,"",location.pathname+(u.toString()?"?"+u:""));
    if(rolar)$("#titLista").scrollIntoView({behavior:"smooth",block:"start"});}
  document.querySelectorAll(".chip").forEach(function(b){b.addEventListener("click",function(){
    if(b.dataset.f==="todas"){f.loja="";f.cat="";}else{f[b.dataset.f]=f[b.dataset.f]===b.dataset.v?"":b.dataset.v;}
    mostrar=POR_PAG;aplicar(true);});});
  document.querySelectorAll(".atalho[data-f],.atalho[data-ordem]").forEach(function(b){b.addEventListener("click",function(e){e.preventDefault();
    if(b.dataset.ordem){f.ordem=f.ordem===b.dataset.ordem?"recentes":b.dataset.ordem;sel.value=f.ordem;}
    else{f[b.dataset.f]=f[b.dataset.f]===b.dataset.v?"":b.dataset.v;}mostrar=POR_PAG;aplicar(true);});});
  sel.addEventListener("change",function(){f.ordem=sel.value;mostrar=POR_PAG;aplicar();});
  $("#maisBtn").addEventListener("click",function(){mostrar+=POR_PAG;aplicar();});
  $("#limpar").addEventListener("click",function(){f.loja="";f.cat="";f.q="";if(campo)campo.value="";mostrar=POR_PAG;aplicar();});
  if(campo){busca.addEventListener("submit",function(e){e.preventDefault();f.q=campo.value.trim().toLowerCase();mostrar=POR_PAG;aplicar(true);campo.blur();});
    campo.addEventListener("input",function(){f.q=campo.value.trim().toLowerCase();mostrar=POR_PAG;aplicar();});}
  aplicar();
})();
