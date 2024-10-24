(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();let[o,g,d]=[null,"accountBook","items"];function b(){let e=indexedDB.open(g,1);e.onerror=t=>console.error("Database error:",t.target.errorCode),e.onsuccess=t=>{o=t.target.result;let r=new CustomEvent("db-opened",{detail:{db:o}});document.dispatchEvent(r)},e.onupgradeneeded=t=>{if(o=t.target.result,!o.objectStoreNames.contains(d)){let r={keyPath:"id",autoIncrement:!0},l=o.createObjectStore(d,r);l.createIndex("date","date"),l.createIndex("content","content"),l.createIndex("price","price")}}}b();function m(){return new Promise((e,t)=>{let a=o.transaction(d,"readonly").objectStore(d).index("date").openCursor(null,"prev"),s=[],i="";a.onsuccess=y=>{let p=y.target.result;if(p){let c=p.value;i!==c.date&&s.push({date:c.date,price:"",content:"",id:-1}),s.push(c),i=c.date,p.continue()}else e(s)},a.onerror=y=>t(y)})}function v(e){return new Promise((t,r)=>{let a=o.transaction(d,"readwrite").objectStore(d).add(e);a.onsuccess=()=>t(),a.onerror=s=>console.error("Add error:",a.error)})}function h(e){return new Promise((t,r)=>{let a=o.transaction(d,"readwrite").objectStore(d).delete(e);a.onsuccess=()=>t(),a.onerror=s=>console.error("Delete error:",a.error)})}let I=document.getElementById("headerDiv");I.innerHTML=`
  <header class="flex flex-col justify-center items-center mb-4">
    <div class="w-full flex justify-between items-center border-b">
      <h1 class="text-4xl text-gray-700 py-3 cursor-pointer">MooNee</h1>
      <div class="cursor-pointer">
        <div class="rounded-md w-7 h-0.5 mb-2 bg-gray-500"></div>
        <div class="rounded-md w-7 h-0.5 mb-2 bg-gray-500"></div>
        <div class="rounded-md w-7 h-0.5 bg-gray-500"></div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-full h-52">
      <span class="text-lg text-gray-500">OOO님, 안녕하세요 😃</span>
      <span class="text-lg text-gray-500 mb-3">이번 달의 거래 내역</span>
      <span id="total" class="text-5xl"></span>
    </div>
    <div class="flex w-full rounded-md border border-gray-200 h-28">
      <div class="flex flex-col justify-center items-center w-full">
        <span class="text-sm text-gray-500 mb-2">수입</span>
        <span id="totalIncome" class="text-2xl text-sky-500"></span>
      </div>
      <div class="w-0.5 h-full bg-gray-200"></div>
      <div class="flex flex-col justify-center items-center w-full">
        <span class="text-sm text-gray-500 mb-2">지출</span>
        <span id="totalExpense" class="text-2xl text-red-500"></span>
      </div>
    </div>
  </header>
`;function u(e){let[t,r,l]=[0,0,0];for(let{id:s,price:i}of e)s!==-1&&(l+=i,i>=0?t+=i:r+=i);[t,r]=[t,r].map(Math.abs);let n=s=>new Intl.NumberFormat().format(s),a=document.getElementById("total");a.textContent=n(Math.abs(l)),document.getElementById("totalIncome").textContent=n(t),document.getElementById("totalExpense").textContent=n(r),l>0?(a.classList.remove("text-gray-500","text-red-500"),a.classList.add("text-sky-500")):l<0?(a.classList.remove("text-gray-500","text-sky-500"),a.classList.add("text-red-500")):(a.classList.remove("text-sky-500","text-red-500"),a.classList.add("text-gray-500"))}let w=document.getElementById("createItemFormSection"),E=`
  <form
    id="createItemForm"
    onsubmit="createItemSubmitHandler(event)"
    class="flex flex-col justify-center items-center mt-6 gap-3 transition-opacity opacity-0 hidden"
  >
    <h2 class="w-full text-lg text-gray-700 mb-2">거래 내역 추가</h2>
    <!-- 수입 | 지출 버튼 -->
    <div class="w-full flex gap-2 h-11">
      <label class="w-1/2">
        <input type="radio" name="option" class="hidden peer" />
        <div
          class="flex justify-center items-center h-full cursor-pointer text-sm border border-sky-400 text-sky-500 rounded-md peer-checked:bg-sky-300 peer-checked:text-white transition-colors duration-75"
        >
          수입
        </div>
      </label>
      <label class="w-1/2">
        <input type="radio" name="option" class="hidden peer" checked />
        <div
          class="flex justify-center items-center h-full cursor-pointer text-sm border border-red-400 text-red-500 rounded-md peer-checked:bg-red-300 peer-checked:text-white transition-colors duration-75"
        >
          지출
        </div>
      </label>
    </div>
    <!-- 날짜 -->
    <div class="flex items-center w-full">
      <label for="date" class="w-10 text-sm text-gray-800">날짜</label>
      <input
        id="date"
        name="date"
        type="date"
        class="w-full text-gray-800 p-1.5 outline-none border-b-2 border-gray-100 focus:border-b-gray-800 transition cursor-pointer"
      />
    </div>
    <!-- 금액 -->
    <div class="flex items-center w-full">
      <label for="price" class="w-10 text-sm text-gray-700">금액</label>
      <input
        id="price"
        name="price"
        type="text"
        class="w-full text-gray-800 p-1.5 outline-none border-b-2 border-gray-100 focus:border-b-gray-800 transition"
        value="0"
        oninput="formatPriceHandler(this)"
      />
    </div>
    <!-- 내용 -->
    <div class="flex items-center w-full mb-2">
      <label for="content" class="w-10 text-sm text-gray-700">내용</label>
      <input
        id="content"
        name="content"
        type="text"
        class="w-full text-gray-800 p-1.5 outline-none border-b-2 border-gray-100 focus:border-b-gray-800 transition"
      />
    </div>
    <!-- 저장 | 취소 버튼 -->
    <div class="w-full flex gap-2 h-11">
      <button
        onclick="hideCreateItemFormHandler(event)"
        class="w-4/12 rounded-md bg-gray-50 border border-gray-400 text-sm text-gray-900"
      >
        취소하기
      </button>
      <button
        onclick="createItemHandler(event)"
        class="w-8/12 rounded-md bg-gray-600 text-gray-50 text-sm"
      >
        저장하기
      </button>
    </div>
  </form>
`;w.innerHTML=E;function x(){document.getElementById("date").value="",document.getElementById("price").value="",document.getElementById("content").value="";let e=document.getElementById("createItemForm");e.classList.add("hidden"),setTimeout(()=>{e.classList.remove("opacity-100"),e.classList.add("opacity-0")},20),document.getElementById("createItemFormButton").classList.remove("hidden")}window.hideCreateItemFormHandler=x;function L(e){let t=e.value.replace(/\D/g,"");e.value=new Intl.NumberFormat().format(t)}window.formatPriceHandler=L;function B(){let e=document.querySelector('input[name="option"]:checked'),t=e?e.nextElementSibling.textContent.trim():null,r=document.getElementById("date").value.trim(),l=document.getElementById("price").value.trim().replaceAll(",",""),n=document.getElementById("content").value.trim();return l=t==="지출"?-+l:+l,{date:r,price:l,content:n}}async function F(e){e.preventDefault();let t=B();if(!t.date||!t.content)return;let r=new CustomEvent("item-added",{detail:{item:t}});document.dispatchEvent(r),x()}window.createItemHandler=F;function j(e){e.preventDefault()}window.createItemSubmitHandler=j;let C=document.getElementById("createItemFormBtnSection"),H=`
  <button
    id="createItemFormButton"
    class="flex justify-center items-center rounded-md bg-gray-600 text-gray-50 h-20 w-full"
    onclick="displayCreateItemFormHandler(event)"
  >
    새로운 거래 내역을 추가하세요
  </button>
`;C.innerHTML=H;function S(){let e=document.getElementById("createItemForm");e.classList.remove("hidden"),setTimeout(()=>{e.classList.remove("opacity-0"),e.classList.add("opacity-100")},20),document.getElementById("createItemFormButton").classList.add("hidden")}window.displayCreateItemFormHandler=S;function $(e){let t=new CustomEvent("item-deleted",{detail:{id:e}});document.dispatchEvent(t)}function k(e){let t=document.createElement("h3");return t.className="w-full h-8 py-1 border-b text-right text-gray-400",[t.id,t.textContent]=[e,e],t}function D({id:e,date:t,price:r,content:l}){let n=document.createElement("li");[n.id,n.onclick]=[e,()=>$(e)],n.className="flex w-full h-14 py-1 rounded-md transition duration-75 hover:bg-gray-50";let a=`text-${r>=0?r===0?"gray":"sky":"red"}-500`;return r=new Intl.NumberFormat().format(r<=0?-r:r),n.innerHTML=`
    <div class="flex flex-col w-full truncate">
      <span class="text-xs text-gray-300">${t}</span>
      <span class="flex items-center truncate text-gray-600 h-full">${l}</span>
    </div>
    <div class="flex justify-end items-center w-28">
      <span class="text-sm ${a}">${r}</span >
    </div>
  `,n}function f(e){const t=document.getElementById("itemList");for(;t.firstChild;)t.firstChild.remove();for(let r of e){if(r.id===-1){let n=k(r.date);t.appendChild(n);continue}let l=D(r);t.appendChild(l)}}function O(e){let t=e.target.textContent.trim(),r=new CustomEvent("item-filtered",{detail:{btnType:t}});document.dispatchEvent(r);let l=document.getElementById("allFilterBtn"),n=document.getElementById("incomeFilterBtn"),a=document.getElementById("expenseFilterBtn");switch(t){case"수입":l.classList.remove("text-gray-700","border-b-2","border-gray-700"),l.classList.add("text-gray-300"),n.classList.remove("text-gray-300"),n.classList.add("text-gray-700","border-b-2","border-gray-700"),a.classList.remove("text-gray-700","border-b-2","border-gray-700"),a.classList.add("text-gray-300");return;case"지출":l.classList.remove("text-gray-700","border-b-2","border-gray-700"),l.classList.add("text-gray-300"),n.classList.remove("text-gray-700","border-b-2","border-gray-700"),n.classList.add("text-gray-300"),a.classList.remove("text-gray-300"),a.classList.add("text-gray-700","border-b-2","border-gray-700");return;case"전체":l.classList.remove("text-gray-300"),l.classList.add("text-gray-700","border-b-2","border-gray-700"),n.classList.remove("text-gray-700","border-b-2","border-gray-700"),n.classList.add("text-gray-300"),a.classList.remove("text-gray-700","border-b-2","border-gray-700"),a.classList.add("text-gray-300");return}}window.clickFilterBtnHandler=O;function P(e,t){var l;if(e==="전체")return t;let r=[];for(let n of t){if(n.id===-1){((l=r.at(-1))==null?void 0:l.id)===-1&&r.pop(),r.push(n);continue}(e==="수입"&&n.price>0||e==="지출"&&n.price<0)&&r.push(n)}return r}document.addEventListener("db-opened",async()=>{let e=await m();f(e),u(e)});document.addEventListener("item-added",async e=>{let{item:t}=e.detail;await v(t);let r=await m();f(r),u(r)});document.addEventListener("item-deleted",async e=>{let{id:t}=e.detail;await h(t);let r=await m();f(r),u(r)});document.addEventListener("item-filtered",async e=>{let{btnType:t}=e.detail,r=await m(),l=P(t,r);f(l),u(r)});
