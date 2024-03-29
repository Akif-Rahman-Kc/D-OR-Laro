var StarRating=function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}function i(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}var s={classNames:{active:"gl-active",base:"gl-star-rating",selected:"gl-selected"},clearable:!0,maxStars:10,prebuilt:!1,stars:null,tooltip:"Select a Rating"},n=function(e,t,i){e.classList[t?"add":"remove"](i)},a=function(e){var t=document.createElement("span");for(var i in e=e||{})t.setAttribute(i,e[i]);return t},r=function(e,t,i){var s=a(i);return e.parentNode.insertBefore(s,t?e.nextSibling:e),s},l=function e(){for(var t=arguments.length,i=new Array(t),s=0;s<t;s++)i[s]=arguments[s];var n={};return i.forEach((function(t){Object.keys(t||{}).forEach((function(s){if(void 0!==i[0][s]){var a=t[s];"Object"!==o(a)||"Object"!==o(n[s])?n[s]=a:n[s]=e(n[s],a)}}))})),n},o=function(e){return{}.toString.call(e).slice(8,-1)},c=function(){function t(i,s){var n,a,r;e(this,t),this.direction=window.getComputedStyle(i,null).getPropertyValue("direction"),this.el=i,this.events={change:this.onChange.bind(this),keydown:this.onKeyDown.bind(this),mousedown:this.onPointerDown.bind(this),mouseleave:this.onPointerLeave.bind(this),mousemove:this.onPointerMove.bind(this),reset:this.onReset.bind(this),touchend:this.onPointerDown.bind(this),touchmove:this.onPointerMove.bind(this)},this.indexActive=null,this.indexSelected=null,this.props=s,this.tick=null,this.ticking=!1,this.values=function(e){var t=[];return[].forEach.call(e.options,(function(e){var i=parseInt(e.value,10)||0;i>0&&t.push({index:e.index,text:e.text,value:i})})),t.sort((function(e,t){return e.value-t.value}))}(i),this.widgetEl=null,this.el.widget&&this.el.widget.destroy(),n=this.values.length,a=1,r=this.props.maxStars,/^\d+$/.test(n)&&a<=n&&n<=r?this.build():this.destroy()}return i(t,[{key:"build",value:function(){this.destroy(),this.buildWidget(),this.selectValue(this.indexSelected=this.selected(),!1),this.handleEvents("add"),this.el.widget=this}},{key:"buildWidget",value:function(){var e,t,i=this;this.props.prebuilt?(e=this.el.parentNode,t=e.querySelector("."+this.props.classNames.base+"--stars")):((e=r(this.el,!1,{class:this.props.classNames.base})).appendChild(this.el),t=r(this.el,!0,{class:this.props.classNames.base+"--stars"}),this.values.forEach((function(e,s){var n=a({"data-index":s,"data-value":e.value});"function"==typeof i.props.stars&&i.props.stars.call(i,n,e,s),[].forEach.call(n.children,(function(e){return e.style.pointerEvents="none"})),t.innerHTML+=n.outerHTML}))),e.dataset.starRating="",e.classList.add(this.props.classNames.base+"--"+this.direction),this.props.tooltip&&t.setAttribute("role","tooltip"),this.widgetEl=t}},{key:"changeIndexTo",value:function(e,t){var i=this;if(this.indexActive!==e||t){if([].forEach.call(this.widgetEl.children,(function(t,s){n(t,s<=e,i.props.classNames.active),n(t,s===i.indexSelected,i.props.classNames.selected)})),"function"==typeof this.props.stars||this.props.prebuilt||(this.widgetEl.classList.remove("s"+10*(this.indexActive+1)),this.widgetEl.classList.add("s"+10*(e+1))),this.props.tooltip){var s=e<0?this.props.tooltip:this.values[e].text;this.widgetEl.setAttribute("aria-label",s)}this.indexActive=e}this.ticking=!1}},{key:"destroy",value:function(){this.indexActive=null,this.indexSelected=this.selected();var e=this.el.parentNode;e.classList.contains(this.props.classNames.base)&&(this.props.prebuilt?(this.widgetEl=e.querySelector("."+this.props.classNames.base+"--stars"),e.classList.remove(this.props.classNames.base+"--"+this.direction),delete e.dataset.starRating):e.parentNode.replaceChild(this.el,e),this.handleEvents("remove")),delete this.el.widget}},{key:"eventListener",value:function(e,t,i,s){var n=this;i.forEach((function(i){return e[t+"EventListener"](i,n.events[i],s||!1)}))}},{key:"handleEvents",value:function(e){var t=this.el.closest("form");t&&"FORM"===t.tagName&&this.eventListener(t,e,["reset"]),this.eventListener(this.el,e,["change"]),"add"===e&&this.el.disabled||(this.eventListener(this.el,e,["keydown"]),this.eventListener(this.widgetEl,e,["mousedown","mouseleave","mousemove","touchend","touchmove"],!1))}},{key:"indexFromEvent",value:function(e){var t,i,s=(null===(t=e.touches)||void 0===t?void 0:t[0])||(null===(i=e.changedTouches)||void 0===i?void 0:i[0])||e,n=document.elementFromPoint(s.clientX,s.clientY);return[].slice.call(n.parentNode.children).indexOf(n)}},{key:"onChange",value:function(){this.changeIndexTo(this.selected(),!0)}},{key:"onKeyDown",value:function(e){var t=e.key.slice(5);if(~["Left","Right"].indexOf(t)){var i="Left"===t?-1:1;"rtl"===this.direction&&(i*=-1);var s=this.values.length-1,n=Math.min(Math.max(this.selected()+i,-1),s);this.selectValue(n,!0)}}},{key:"onPointerDown",value:function(e){e.preventDefault();var t=this.indexFromEvent(e);this.props.clearable&&t===this.indexSelected&&(t=-1),this.selectValue(t,!0)}},{key:"onPointerLeave",value:function(e){var t=this;e.preventDefault(),cancelAnimationFrame(this.tick),requestAnimationFrame((function(){return t.changeIndexTo(t.indexSelected)}))}},{key:"onPointerMove",value:function(e){var t=this;e.preventDefault(),this.ticking||(this.tick=requestAnimationFrame((function(){return t.changeIndexTo(t.indexFromEvent(e))})),this.ticking=!0)}},{key:"onReset",value:function(){var e;this.selectValue((null===(e=this.el.querySelector("[selected]"))||void 0===e?void 0:e.index)||-1,!1)}},{key:"selected",value:function(){var e=this;return this.values.findIndex((function(t){return t.value===+e.el.value}))}},{key:"selectValue",value:function(e,t){var i;this.el.value=(null===(i=this.values[e])||void 0===i?void 0:i.value)||"",this.indexSelected=this.selected(),!1===t?this.changeIndexTo(this.selected(),!0):this.el.dispatchEvent(new Event("change"))}}]),t}();return function(){function t(i,s){e(this,t),this.destroy=this.destroy.bind(this),this.rebuild=this.rebuild.bind(this),this.widgets=[],this.buildWidgets(i,s)}return i(t,[{key:"buildWidgets",value:function(e,t){var i=this;this.queryElements(e).forEach((function(e){var n=l(s,t,JSON.parse(e.getAttribute("data-options")));"SELECT"!==e.tagName||e.widget||(!n.prebuilt&&e.parentNode.classList.contains(n.classNames.base)&&i.unwrap(e),i.widgets.push(new c(e,n)))}))}},{key:"destroy",value:function(){this.widgets.forEach((function(e){return e.destroy()}))}},{key:"queryElements",value:function(e){return"HTMLSelectElement"===o(e)?[e]:"NodeList"===o(e)?[].slice.call(e):"String"===o(e)?[].slice.call(document.querySelectorAll(e)):[]}},{key:"rebuild",value:function(){this.widgets.forEach((function(e){return e.build()}))}},{key:"unwrap",value:function(e){var t=e.parentNode,i=t.parentNode;i.insertBefore(e,t),i.removeChild(t)}}]),t}()}();



// ------------------------------------------------------------------------------
// Custom code
const selects = document.querySelectorAll(".js-rating");

if (selects.length) {
  const STARS = 5;
  const star = (id, color) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
      <defs>
        <linearGradient id="${id}" y1="10" x2="18" y2="10" gradientUnits="userSpaceOnUse">
          <stop stop-color="${color}" offset="0" class="svg-stop svg-stop-half"/>
          <stop stop-color="${color}" offset="0.5" class="svg-stop svg-stop-half"/>
          <stop stop-color="${color}" offset="0.5" class="svg-stop"/>
          <stop stop-color="${color}" offset="1" class="svg-stop"/>
        </linearGradient>
      </defs>
      <path d="M3.45,17.5,9,.5l5.55,17L0,7H18Z" fill="url(#${id})"/>
    </svg>
  `;

  function isNumeric(value) {
    const n = Number(value);
    return !Number.isNaN(n) && Number.isFinite(n);
  }

  selects.forEach(function(select, index) {
    const rating = select.dataset.rating;
    const color = select.dataset.color || "#e6e6e6";

    const starRating = new StarRating(select, {
      maxStars: STARS,
      tooltip: false,
      stars: function (el, item, i) {
        el.innerHTML = star(`gradient_${index}_${i + 1}`, color);
      }
    });

    if (rating && isNumeric(rating)) {
      let n = +rating;

      n = n < 0.05 ? "0" : n > STARS ? STARS.toFixed(1) : n.toFixed(1);

      select.selectedIndex = Math.floor(n);
      starRating.rebuild();

      select.parentElement.dataset.starRating = n;

      if (!Number.isInteger(+n)) {
        select.nextElementSibling.children[Math.floor(n)].classList.add("star-half");
      }
    }

    select.addEventListener("change", function (e) {
      [...e.target.nextElementSibling.children].forEach((item) =>
        item.classList.remove("star-half")
      );
    });
  });
}
