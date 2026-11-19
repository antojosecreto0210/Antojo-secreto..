let items=[];
const $=id=>document.getElementById(id);
const form=$("productForm");
const money=n=>n==null?"Precio por confirmar":new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function load(){try{const r=await fetch("products.json",{cache:"no-store"});if(!r.ok)throw 0;items=await r.json();}catch(e){items=[];alert("No se pudo leer products.json. Abre este panel desde tu página publicada, no como archivo local.");}render();}
function render(){
 $("adminList").innerHTML=items.map(p=>`<div class="admin-item"><div class="admin-item-main"><img class="preview" src="${escapeHtml(p.image)}" onerror="this.src='assets/logo-antojo-secreto.jpg'"><span><b>${escapeHtml(p.name)}</b><small>${escapeHtml(p.category)} · ${money(p.price)} · Stock: ${p.stock??"Consultar"}</small></span></div><div class="admin-actions"><button class="admin-btn" onclick="editItem('${p.id}')">Editar</button><button class="admin-btn red" onclick="deleteItem('${p.id}')">Eliminar</button></div></div>`).join("");
 const cats=[...new Set(items.map(p=>p.category))];$("categories").innerHTML=cats.map(c=>`<option value="${escapeHtml(c)}">`).join("");
}
function reset(){form.reset();$("editId").value="";}
window.editItem=id=>{const p=items.find(x=>x.id===id);if(!p)return;$("editId").value=p.id;$("name").value=p.name;$("cat").value=p.category;$("price").value=p.price??"";$("stock").value=p.stock??"";$("desc").value=p.description??"";window.scrollTo({top:0,behavior:"smooth"});};
window.deleteItem=id=>{if(confirm("¿Eliminar este producto del catálogo?")){items=items.filter(p=>p.id!==id);render();}};
async function imageData(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const canvas=document.createElement("canvas");const scale=Math.min(1,1200/Math.max(img.width,img.height));canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL("image/jpeg",.82));};img.onerror=reject;img.src=reader.result;};reader.onerror=reject;reader.readAsDataURL(file);});}
form.addEventListener("submit",async e=>{e.preventDefault();const id=$("editId").value||`AS-${Date.now()}`;const old=items.find(p=>p.id===id);let image=old?.image||"assets/logo-antojo-secreto.jpg";const file=$("photo").files[0];if(file)image=await imageData(file);const p={id,name:$("name").value.trim(),category:$("cat").value.trim(),price:$("price").value===""?null:Number($("price").value),stock:$("stock").value===""?null:Number($("stock").value),description:$("desc").value.trim(),image,active:true};if(old)items=items.map(x=>x.id===id?p:x);else items.unshift(p);reset();render();alert("Producto guardado en este panel. Descarga products.json para publicar los cambios.");});
$("resetForm").addEventListener("click",reset);
$("exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(items,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="products.json";a.click();URL.revokeObjectURL(a.href);});
$("importBtn").addEventListener("click",()=>$("importFile").click());
$("importFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!Array.isArray(data))throw 0;items=data;render();alert("Catálogo importado.");}catch(err){alert("El archivo no tiene un formato products.json válido.");}e.target.value="";});
load();