const WHATSAPP = "573052942120";
const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");
const category = document.getElementById("categoryFilter");
const sort = document.getElementById("sortFilter");
const count = document.getElementById("resultCount");
const empty = document.getElementById("emptyState");
let products = [];

const money = value => value == null ? "Consultar precio" : new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(Number(value));

function safeText(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function stockText(stock){return stock === null || stock === undefined || stock === "" ? "Consultar disponibilidad" : Number(stock)>0 ? `${stock} disponibles` : "Agotado";}
function whatsappUrl(p){
  const message = `Hola Antojo Secreto, quiero este producto: ${p.name}. Precio: ${money(p.price)}. ¿Me confirmas disponibilidad?`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}
function render(){
  const term = search.value.trim().toLocaleLowerCase("es");
  let list = products.filter(p=>p.active!==false && (!term || `${p.name} ${p.description} ${p.category}`.toLocaleLowerCase("es").includes(term)) && (!category.value || p.category===category.value));
  if(sort.value==="price-asc") list.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
  if(sort.value==="price-desc") list.sort((a,b)=>(b.price??-Infinity)-(a.price??-Infinity));
  if(sort.value==="name") list.sort((a,b)=>a.name.localeCompare(b.name,"es"));
  count.textContent = `${list.length} producto${list.length===1?"":"s"}`;
  empty.hidden = list.length>0;
  grid.innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${safeText(p.image)}" alt="${safeText(p.name)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/logo-antojo-secreto.jpg';this.style.objectFit='contain'">
      </div>
      <div class="product-info">
        <span class="product-category">${safeText(p.category)}</span>
        <h3>${safeText(p.name)}</h3>
        <p>${safeText(p.description||"Un detalle especial para sorprender y consentir.")}</p>
        <div class="product-meta"><strong class="product-price">${money(p.price)}</strong><span class="product-stock">${stockText(p.stock)}</span></div>
        <a class="want-button" href="${whatsappUrl(p)}" target="_blank" rel="noopener">¡LO QUIERO! · WhatsApp</a>
      </div>
    </article>`).join("");
}
async function init(){
  document.getElementById("year").textContent=new Date().getFullYear();
  try{
    const res=await fetch("products.json",{cache:"no-store"});
    if(!res.ok) throw new Error("No se pudo cargar products.json");
    products=await res.json();
    products=products.map(p=>({...p,image:p.image.split("/").pop()}));
    const categories=[...new Set(products.filter(p=>p.active!==false).map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
    category.innerHTML='<option value="">Todas las categorías</option>'+categories.map(c=>`<option value="${safeText(c)}">${safeText(c)}</option>`).join("");
    render();
  }catch(err){count.textContent="No fue posible cargar el catálogo";empty.hidden=false;empty.textContent="Revisa que products.json esté en la carpeta principal del sitio.";}
}
search.addEventListener("input",render);category.addEventListener("change",render);sort.addEventListener("change",render);
const menuToggle=document.getElementById("menuToggle"), nav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}));
init();
