"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var t=require("react"),s=e(t),i=e(require("axios"));class a{constructor(e){this.baseUrl=e,this.get=(e,t,s,i)=>this.fetch(e,t,i),this.post=(e,t,s,i)=>this.fetchWithBody("POST",e,t,s,i),this.delete=(e,t,s,i)=>this.fetchWithBody("DELETE",e,t,s,i),this.put=(e,t,s,i)=>this.fetchWithBody("PUT",e,t,s,i),this.absUrl=e=>this.baseUrl+e,this.getHeaders=e=>e?{Authorization:e,"Access-Control-Allow-Origin":"*"}:{},this.handleCancel=()=>null,this.fetch=(e,t,s={})=>i.get(this.absUrl(e),Object.assign(Object.assign({},s),{headers:Object.assign(Object.assign({},this.getHeaders(t)),"object"==typeof s.headers?s.headers:{})})).then(e=>e).catch(e=>{if(i.isCancel(e))return this.handleCancel();throw e}),this.fetchWithBody=(e,t,s,a={},n={})=>i(Object.assign(Object.assign({method:e,url:this.absUrl(t),data:a},n),{headers:Object.assign(Object.assign({},this.getHeaders(s)),"object"==typeof n.headers?n.headers:{})})).then(e=>e).catch(e=>{if(i.isCancel(e))return this.handleCancel();throw e})}}const n=t.createContext({authorizationToken:"",HttpService:new a(""),isProviderAdded:!1,cacheStore:{},updateCache:()=>{}});const c=e=>{try{return e.response&&e.response.data&&e.response.data.message||e.message}catch(t){return e}};exports.UseFetchProvider=e=>{const{children:i,baseUrl:c,authorizationToken:o}=e,r=new a(c),[d,h]=t.useState({});return s.createElement(n.Provider,{value:{authorizationToken:o,HttpService:r,isProviderAdded:!0,cacheStore:d,updateCache:(e,t)=>h(s=>Object.assign(Object.assign({},s),{[e]:t}))}},i)},exports.useFetch=e=>{"string"==typeof e&&(e={url:e});const{url:s,method:a="get",mockData:o,shouldDispatch:r,cancelable:d=!1,cache:h=!1,shouldUseAuthToken:l=!0,dependencies:u,before:f=(()=>{}),after:g=(()=>{}),alter:b,options:p={}}=e,{authorizationToken:j,HttpService:v,isProviderAdded:O,cacheStore:C,updateCache:y}=t.useContext(n);if(!O)throw new Error("You must wrap your higher level(parent) component with UseFetchProvider, before using useFetch 😬");let k=(e=>{let t="";return t="function"==typeof e?e():e,t})(j);const P=u||[],w=!!o,F=l?k:null,T="get"===a&&h;let U=i.CancelToken.source();const m={data:o,status:{isPending:!1,isRejected:!1,isFulfilled:!1,isCached:!1,isMocked:w,err:""}},[S,x]=t.useState(m),M=e=>{return t=void 0,i=void 0,o=function*(){var t,i;if(f(),x({data:S.data?S.data:void 0,status:{isFulfilled:!1,isPending:!0,isRejected:!1,isCached:!1,isMocked:w,err:""}}),T){let e=C[s];e&&(e=Object.assign(Object.assign({},e),{status:Object.assign(Object.assign({},e.status),{isMocked:!1,isFulfilled:!0,isCached:!0})}),x(e),g(e))}null===(i=(t=v)[a])||void 0===i||i.call(t,s,F,e,Object.assign(Object.assign({},p),{cancelToken:U.token})).then(({data:e})=>{let t=e;"function"==typeof b&&(t=b(e));const i={data:t,status:{isFulfilled:!0,isPending:!1,isRejected:!1,isMocked:!1,isCached:!1,err:""}};x(i),g(i),T&&y(s,i)}).catch(e=>{const t={data:S.data,status:{isFulfilled:!1,isPending:!1,isCached:!1,isRejected:!0,isMocked:w,err:c(e)}};x(t),g(t)})},new((n=void 0)||(n=Promise))((function(e,s){function a(e){try{r(o.next(e))}catch(e){s(e)}}function c(e){try{r(o.throw(e))}catch(e){s(e)}}function r(t){t.done?e(t.value):new n((function(e){e(t.value)})).then(a,c)}r((o=o.apply(t,i||[])).next())}));
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var t,i,n,o};return t.useEffect(()=>{r?("function"==typeof r&&r()||"boolean"==typeof r&&r)&&M():void 0===r&&void 0!==u&&M()},[...P]),t.useEffect(()=>()=>{d&&U.cancel()},[]),[S,M,e=>{if(S.data){const t=e(S.data);(e=>{T&&y(s,{data:e,status:Object.assign(Object.assign({},m.status),{isCached:!0,isMocked:!1,isFulfilled:!0})})})(t),x({data:t,status:{isFulfilled:!0,isPending:!1,isRejected:!1,isMocked:!1,isCached:!1,err:""}})}}]};
